import Link from "next/link";
import { LinkButton } from "@/components/ui";
import { StudentCard } from "@/components/StudentCard";
import { getPublicStudents } from "@/lib/students";
import { getPlatformTotals, type PlatformTotals } from "@/lib/reconciliation";
import { formatCents } from "@/lib/money";

export const dynamic = "force-dynamic";

const EMPTY_TOTALS: PlatformTotals = {
  raisedCents: 0,
  pendingCents: 0,
  disbursedCents: 0,
  heldBalanceCents: 0,
  studentCount: 0,
  donorCount: 0,
  contributionCount: 0,
  disbursementCount: 0,
  reconciled: true,
};

export default async function HomePage() {
  // Degrade gracefully if the database is briefly unavailable.
  const [totals, students] = await Promise.all([
    getPlatformTotals().catch(() => EMPTY_TOTALS),
    getPublicStudents().catch(() => []),
  ]);
  const featured = students.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
              Nonprofit · Education funding
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Fund a student&apos;s future,{" "}
              <span className="text-brand-600">dollar by dollar.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              ScholarUz connects donors with talented students who lack access to
              educational funding. Every contribution is tracked transparently — from
              your pledge to the moment it reaches a student&apos;s school.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/students" size="lg">
                Browse students
              </LinkButton>
              <LinkButton href="/register" variant="outline" size="lg">
                Become a donor
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-10 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-4">
          <Stat label="Contributed" value={formatCents(totals.raisedCents)} />
          <Stat label="Students supported" value={String(totals.studentCount)} />
          <Stat label="Donors" value={String(totals.donorCount)} />
          <Stat label="Disbursed to schools" value={formatCents(totals.disbursedCents)} />
        </div>
      </section>

      {/* Featured students */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Students who need you</h2>
            <p className="mt-1 text-muted">Browse verified students and fund their education.</p>
          </div>
          <Link href="/students" className="text-sm font-semibold text-brand-700 hover:underline">
            View all →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <StudentCard key={s.id} student={s} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-muted">
            No students are listed yet. Once students are approved, they&apos;ll appear here.
          </p>
        )}
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-ink">How ScholarUz works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Step
              n={1}
              title="Donors pledge"
              body="Donors browse students and contribute any amount through secure Stripe payments. Each contribution is recorded against a specific student."
            />
            <Step
              n={2}
              title="Funds are tracked"
              body="ScholarUz holds and reconciles funds, tracking every contribution's status and each student's progress toward their goal."
            />
            <Step
              n={3}
              title="Disbursed to schools"
              body="Admins disburse funds to students' institutions and confirm receipt — keeping the books fully reconciled, pledge to payout."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-brand-600 px-8 py-14 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold">Ready to change a life?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">
            Whether you want to fund a student or you&apos;re a student seeking support,
            ScholarUz makes it transparent and simple.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <LinkButton href="/students" variant="accent" size="lg">
              Fund a student
            </LinkButton>
            <LinkButton
              href="/register"
              variant="outline"
              size="lg"
              className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20"
            >
              Apply as a student
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
        {n}
      </div>
      <h3 className="mt-4 font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}
