"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createDisbursementAction, type DisbursementState } from "@/app/actions/admin";
import { FormError, buttonClass } from "./ui";
import { formatCents } from "@/lib/money";

type Option = { id: string; name: string; heldCents: number };

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
      {pending ? "Scheduling…" : "Schedule disbursement"}
    </button>
  );
}

export function DisbursementForm({ students }: { students: Option[] }) {
  const [state, formAction] = useActionState<DisbursementState, FormData>(
    createDisbursementAction,
    {},
  );

  const fundable = students.filter((s) => s.heldCents > 0);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Student
          <select name="studentId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select a student…
            </option>
            {fundable.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({formatCents(s.heldCents)} available)
              </option>
            ))}
          </select>
          {fundable.length === 0 && (
            <span className="mt-1 block text-xs text-muted">
              No students currently have a held balance to disburse.
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Amount (USD)
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="text-slate-500">$</span>
            <input
              name="amountDollars"
              type="number"
              min={1}
              step="1"
              required
              className="w-full bg-transparent px-2 py-2 text-ink outline-none"
            />
          </div>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Reference (optional)
          <input
            name="reference"
            type="text"
            placeholder="Wire ref / invoice #"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Note (optional)
          <input name="note" type="text" placeholder="e.g. Fall tuition" className={inputClass} />
        </label>
      </div>

      <FormError message={state.error} />
      {state.success && (
        <p className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800">
          {state.success}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
