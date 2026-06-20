import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { RegisterForm } from "@/components/AuthForms";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="text-center">
        <Logo sizeClass="text-2xl" />
        <h1 className="mt-6 text-2xl font-bold text-ink">Create your account</h1>
        <p className="mt-1 text-muted">Join as a donor to give, or as a student to seek support.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
