import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { prisma } from "./db";

const SESSION_COOKIE = "scholaruz_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const BCRYPT_ROUNDS = 12;

const isDev = process.env.NODE_ENV === "development";

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    // Only fall back to an insecure constant in explicit local development.
    // Any other environment (production, preview, staging, unset NODE_ENV)
    // must provide a real AUTH_SECRET — otherwise sessions would be forgeable.
    if (!isDev) {
      throw new Error("AUTH_SECRET is not set or is too short.");
    }
    return new TextEncoder().encode("dev-only-insecure-secret-change-me-please");
  }
  return new TextEncoder().encode(secret);
}

/** True only for safe same-origin relative paths (blocks open redirects). */
export function isSafeNextPath(next: unknown): next is string {
  if (typeof next !== "string") return false;
  if (!next.startsWith("/") || next.startsWith("//")) return false;
  if (next.includes("\\")) return false;
  // Reject ASCII control characters (CR/LF header-injection, etc.).
  for (let i = 0; i < next.length; i++) {
    const code = next.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;
  }
  return true;
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Secure everywhere except explicit local development (http://localhost).
    secure: !isDev,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the signed-in user, or null. Never throws. Stateless (no DB hit). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    // Pin the accepted algorithm so only the HMAC we issue is ever verified.
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

/** Require any signed-in user; redirect to /login otherwise. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Require a specific role. Re-validates the user (and their role) against the
 * database so that a deleted or demoted account loses access immediately,
 * instead of waiting for the JWT to expire. Redirects if not authorized.
 */
export async function requireRole(role: Role): Promise<SessionUser> {
  const sessionUser = await requireUser();
  const fresh = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!fresh || fresh.role !== role) redirect("/");
  return fresh;
}
