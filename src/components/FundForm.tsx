"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, FormError, buttonClass } from "./ui";

const PRESETS = [25, 50, 100, 250];

export function FundForm({
  studentId,
  isAuthed,
  fullyFunded,
}: {
  studentId: string;
  isAuthed: boolean;
  fullyFunded: boolean;
}) {
  const [preset, setPreset] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  if (!isAuthed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-ink">Support this student</h3>
        <p className="mt-2 text-sm text-muted">
          Create a free donor account or sign in to make a contribution.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/login?next=/students/${studentId}`}
            className={buttonClass("primary", "md", "w-full")}
          >
            Sign in to fund
          </Link>
          <Link
            href="/register"
            className={buttonClass("outline", "md", "w-full")}
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  const dollars = custom !== "" ? Number(custom) : preset ?? 0;
  const amountCents = Math.round((Number.isFinite(dollars) ? dollars : 0) * 100);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    if (!amountCents || amountCents < 100) {
      setError("Please enter at least $1.");
      return;
    }
    if (amountCents > 2_000_000) {
      setError("The maximum single contribution is $20,000.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          amountCents,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="font-semibold text-ink">Make a contribution</h3>
      {fullyFunded && (
        <p className="mt-2 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-800">
          This student has reached their goal — extra contributions still help cover
          ongoing costs.
        </p>
      )}

      <div className="mt-4 grid grid-cols-4 gap-2">
        {PRESETS.map((amt) => {
          const active = custom === "" && preset === amt;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setPreset(amt);
                setCustom("");
              }}
              className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              ${amt}
            </button>
          );
        })}
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Or enter an amount
        <div className="mt-1 flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
          <span className="text-slate-500">$</span>
          <input
            type="number"
            min={1}
            max={20000}
            step="1"
            inputMode="decimal"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setPreset(null);
            }}
            placeholder="Custom"
            className="w-full bg-transparent px-2 py-2 text-ink outline-none"
          />
        </div>
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Message (optional)
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="Wishing you the best in your studies!"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      <FormError message={error} />

      <div className="mt-4">
        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Redirecting to secure checkout…" : `Contribute $${amountCents ? (amountCents / 100).toLocaleString() : "0"}`}
        </Button>
        <p className="mt-2 text-center text-xs text-muted">
          Secure payment via Stripe. You&apos;ll be redirected to complete your contribution.
        </p>
      </div>
    </form>
  );
}
