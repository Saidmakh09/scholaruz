import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser, isSafeNextPath } from "@/lib/auth";
import { LoginForm } from "@/components/AuthForms";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign in" };

type Params = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Params) {
  const [{ next }, user] = await Promise.all([searchParams, getSessionUser()]);
  if (user) redirect("/dashboard");

  const safeNext = isSafeNextPath(next) ? next : undefined;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="text-center">
        <Logo sizeClass="text-2xl" />
        <h1 className="mt-6 text-2xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1 text-muted">Sign in to your ScholarUz account.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <LoginForm next={safeNext} />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-accent-300 bg-accent-50 p-4 text-sm">
        <p className="font-semibold text-accent-800">Explore with a demo account</p>
        <ul className="mt-2 space-y-1 text-accent-900">
          <li>
            <span className="font-medium">Admin:</span> admin@scholaruz.org
          </li>
          <li>
            <span className="font-medium">Donor:</span> donor@scholaruz.org
          </li>
          <li>
            <span className="font-medium">Student:</span> student@scholaruz.org
          </li>
        </ul>
        <p className="mt-2 text-accent-900">
          Password for all demo accounts: <span className="font-mono font-semibold">Demo!2026</span>
        </p>
      </div>
    </div>
  );
}
