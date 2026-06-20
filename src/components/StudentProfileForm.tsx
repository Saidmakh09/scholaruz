"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { upsertStudentProfile, type ProfileState } from "@/app/actions/students";
import { FormError, buttonClass } from "./ui";

export type ProfileDefaults = {
  fullName: string;
  school: string;
  fieldOfStudy: string;
  yearOfStudy: string;
  city: string;
  country: string;
  story: string;
  goalDollars: string;
  imageUrl: string;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
      {pending ? "Saving…" : isNew ? "Submit for review" : "Save changes"}
    </button>
  );
}

export function StudentProfileForm({
  defaults,
  isNew,
}: {
  defaults: ProfileDefaults;
  isNew: boolean;
}) {
  const [state, formAction] = useActionState<ProfileState, FormData>(upsertStudentProfile, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" defaultValue={defaults.fullName} required />
        <Field label="School / University" name="school" defaultValue={defaults.school} required />
        <Field
          label="Field of study"
          name="fieldOfStudy"
          defaultValue={defaults.fieldOfStudy}
          required
        />
        <Field
          label="Year of study"
          name="yearOfStudy"
          defaultValue={defaults.yearOfStudy}
          placeholder="e.g. 2nd year"
          required
        />
        <Field label="City" name="city" defaultValue={defaults.city} required />
        <Field label="Country" name="country" defaultValue={defaults.country} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Funding goal (USD)
          <div className="mt-1 flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="text-slate-500">$</span>
            <input
              name="goalDollars"
              type="number"
              min={100}
              max={100000}
              step="1"
              defaultValue={defaults.goalDollars}
              required
              className="w-full bg-transparent px-2 py-2 text-ink outline-none"
            />
          </div>
        </label>
        <Field
          label="Photo URL (optional)"
          name="imageUrl"
          defaultValue={defaults.imageUrl}
          placeholder="https://…"
          type="url"
        />
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Your story
        <textarea
          name="story"
          rows={6}
          defaultValue={defaults.story}
          required
          minLength={30}
          maxLength={4000}
          placeholder="Tell donors about your studies, your goals, and why you need support."
          className={inputClass}
        />
      </label>

      <FormError message={state.error} />
      {state.success && (
        <p className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800">
          Saved! {isNew ? "Your profile is pending admin review." : "Your changes are live."}
        </p>
      )}

      <SaveButton isNew={isNew} />
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </label>
  );
}
