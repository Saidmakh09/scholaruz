import type { Metadata } from "next";
import { LinkButton } from "@/components/ui";
import { CoverImage } from "@/components/CoverImage";
import { uz } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "ScholarUz is a nonprofit scholarship platform connecting donors with university students in Uzbekistan, with transparent funding from pledge to disbursement.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <CoverImage src={uz.campus.src} alt={uz.campus.alt} priority className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-24 text-white sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/30">
              About ScholarUz
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              A new way to fund education
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              We connect generous donors with university students in Uzbekistan who need
              support, and we make every step transparent, from the first pledge to the moment
              funds reach a student&apos;s school.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-ink">Why we exist</h2>
        <p className="mt-3 text-lg text-slate-600">
          Talented students are too often held back not by ability, but by access to funding.
          Donors, meanwhile, want to give but rarely see where their money goes. ScholarUz
          closes that gap with a platform built around four clear and open steps.
        </p>

        <div className="mt-8 space-y-5">
          <Workflow
            title="1. Students"
            body="Students apply with their school, field of study, funding goal, and story. A reviewer approves each profile before it goes live."
          />
          <Workflow
            title="2. Donors"
            body="Donors create an account, browse approved students, and contribute any amount toward a student's goal."
          />
          <Workflow
            title="3. Contributions"
            body="Each contribution is processed securely through Stripe and recorded with its full status, from pending to succeeded."
          />
          <Workflow
            title="4. Disbursements"
            body="Funds are disbursed to a student's institution and confirmed. The platform reconciles money in against money out, so the books always balance."
          />
        </div>

        <h2 className="mt-14 text-2xl font-bold text-ink">Transparency by design</h2>
        <p className="mt-3 text-slate-600">
          A reconciliation focused admin view tracks contribution status, each student&apos;s
          funding progress, and the state of every disbursement, flagging anything that does not
          balance. Donors can trust that their support reaches the student it was meant for.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/students" size="lg">
            Browse students
          </LinkButton>
          <LinkButton href="/scholarship" variant="outline" size="lg">
            See how the scholarship works
          </LinkButton>
        </div>
      </section>
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
