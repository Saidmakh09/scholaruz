"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  isSafeNextPath,
} from "@/lib/auth";

export type AuthState = { error?: string };

function firstError(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Please check the form and try again.";
}

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
  role: z.enum(["DONOR", "STUDENT"]),
});

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Try signing in." };
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
    },
  });

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Students go set up their profile; donors head to browse students.
  redirect(user.role === "STUDENT" ? "/dashboard" : "/students");
}

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(120),
  password: z.string().min(1, "Enter your password."),
});

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  // Always run a comparison-shaped path to avoid leaking which emails exist.
  const ok = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) {
    return { error: "Incorrect email or password." };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Honor a safe, same-site "next" path if one was provided.
  const next = formData.get("next");
  if (isSafeNextPath(next)) {
    redirect(next);
  }
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
