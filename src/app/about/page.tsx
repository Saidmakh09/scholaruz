import type { Metadata } from "next";
import { LinkButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "ScholarUz is a nonprofit connecting donors with students who lack access to educational funding, with transparent reconciliation from pledge to disbursement.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-ink">About ScholarUz</h1>
      <p className="mt-4 text-lg text-slate-600">
        ScholarUz is a nonprofit platform connecting donors with students who lack access to
        educational funding. We make giving transparent: every dollar is tracked from the
        moment it&apos;s pledged to the moment it reaches a student&apos;s institution.
      </p>

      <h2 className="mt-12 text-xl font-bold text-ink">Why we exist</h2>
      <p className="mt-3 text-slate-600">
        Talented students are often held back not by ability, but by access to funding. Donors,
        meanwhile, want to give but rarely see where their money goes. ScholarUz closes that gap
        with a platform built around four transparent workflows.
      </p>

      <div className="mt-8 space-y-5">
        <Workflow
          title="1. Students"
          body="Students apply with their school, field of study, funding goal, and story. An admin reviews and approves each profile before it goes live."
        />
        <Workflow
          title="2. Donors"
          body="Donors create an account, browse approved students, and contribute any amount toward a student's goal."
        />
        <Workflow
          title="3. Contributions"
          body="Each contribution is processed securely through Stripe and recorded with its full status — pending, succeeded, failed, or refunded."
        />
        <Workflow
          title="4. Disbursements"
          body="Admins disburse pooled funds to students' institutions and confirm receipt. The platform reconciles money in against money out, so the books always balance."
        />
      </div>

      <h2 className="mt-12 text-xl font-bold text-ink">Transparency by design</h2>
      <p className="mt-3 text-slate-600">
        A reconciliation-oriented admin dashboard tracks contribution status, each student&apos;s
        funding progress, and the state of every disbursement — flagging anything that doesn&apos;t
        balance. Donors can trust that their support reaches the student it was meant for.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        <LinkButton href="/students" size="lg">
          Browse students
        </LinkButton>
        <LinkButton href="/register" variant="outline" size="lg">
          Create an account
        </LinkButton>
      </div>
    </div>
  );
}

function Workflow({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-brand-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}
