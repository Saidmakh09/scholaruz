"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";
import { FormError, buttonClass } from "./ui";

const initial: AuthState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClass("primary", "lg", "w-full")}
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initial);
  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </label>
      <FormError message={state.error} />
      <SubmitButton label="Sign in" />
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="font-semibold text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initial);
  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Full name
        <input name="name" type="text" autoComplete="name" required className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-muted">At least 8 characters.</span>
      </label>

      <fieldset className="block text-sm font-medium text-slate-700">
        I am a…
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input type="radio" name="role" value="DONOR" defaultChecked className="accent-brand-500" />
            <span>Donor</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input type="radio" name="role" value="STUDENT" className="accent-brand-500" />
            <span>Student</span>
          </label>
        </div>
      </fieldset>

      <FormError message={state.error} />
      <SubmitButton label="Create account" />
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
