import Link from "next/link";
import { LinkButton } from "@/components/ui";
import { StudentCard } from "@/components/StudentCard";
import { CoverImage } from "@/components/CoverImage";
import { getPublicStudents } from "@/lib/students";
import { getPlatformTotals, type PlatformTotals } from "@/lib/reconciliation";
import { formatCents } from "@/lib/money";
import { uz, galleryImages } from "@/lib/images";

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
  const [totals, students] = await Promise.all([
    getPlatformTotals().catch(() => EMPTY_TOTALS),
    getPublicStudents().catch(() => []),
  ]);
  const featured = students.slice(0, 3);

  return (
    <div>
      {/* Hero with a photo of the Registan in Samarkand */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <CoverImage
            src={uz.registan.src}
            alt={uz.registan.alt}
            priority
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-28 text-white sm:py-36">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/30">
              Nonprofit · Scholarships for university students
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Fund a student&apos;s future, dollar by dollar.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              ScholarUz is a new way to help university students in Uzbekistan reach
              graduation. Donors give what they can, students get the support they need,
              and every contribution is tracked openly from pledge to disbursement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/students" size="lg">
                Browse students
              </LinkButton>
              <LinkButton
                href="/scholarship"
                variant="outline"
                size="lg"
                className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20"
              >
                How the scholarship works
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band. Uses relative z-10 so the card paints above the hero where they overlap. */}
      <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:grid-cols-4">
          <Stat label="Contributed" value={formatCents(totals.raisedCents)} />
          <Stat label="Students supported" value={String(totals.studentCount)} />
          <Stat label="Donors" value={String(totals.donorCount)} />
          <Stat label="Disbursed to schools" value={formatCents(totals.disbursedCents)} />
        </div>
      </section>

      {/* A new way to help */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              A new way to help
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              Keep talented students in university
            </h2>
            <p className="mt-4 text-slate-600">
              Too many students are held back not by ability but by access to funding.
              ScholarUz turns small contributions from many donors into real scholarships,
              paid directly toward tuition and university costs. It is a simple, transparent
              way for anyone, anywhere, to help a student stay in school and graduate.
            </p>
            <ul className="mt-6 space-y-3">
              <Feature title="Give any amount">
                Contribute whatever you can toward a student you choose.
              </Feature>
              <Feature title="Follow your impact">
                Watch each student&apos;s progress toward their goal in real numbers.
              </Feature>
              <Feature title="Funds reach the school">
                Money is disbursed to a student&apos;s institution and reconciled openly.
              </Feature>
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-md">
            <CoverImage src={uz.campus.src} alt={uz.campus.alt} className="h-80 w-full lg:h-96" />
          </div>
        </div>
      </section>

      {/* Featured students */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Students who need you</h2>
            <p className="mt-1 text-muted">Browse verified students and fund their education.</p>
          </div>
          <Link href="/students" className="text-sm font-semibold text-brand-700 hover:underline">
            View all
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
            No students are listed yet. Once students are approved, they will appear here.
          </p>
        )}
      </section>

      {/* Rooted in Uzbekistan gallery */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Rooted in Uzbekistan
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink">
            Home to ancient cities and a new generation
          </h2>
          <p className="mt-4 text-slate-600">
            We start in Uzbekistan, a land of breathtaking architecture, warm people, and
            students ready to build its future. Your support helps that future arrive sooner.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {galleryImages.map((img) => (
            <figure key={img.src} className="group overflow-hidden rounded-2xl shadow-sm">
              <CoverImage
                src={img.src}
                alt={img.alt}
                className="h-44 w-full transition-transform duration-500 group-hover:scale-105 sm:h-52"
              />
              <figcaption className="bg-white px-3 py-2 text-xs font-medium text-muted">
                {img.credit}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Scholarship + Resources teasers */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid gap-6 md:grid-cols-2">
          <TeaserCard
            href="/scholarship"
            eyebrow="The ScholarUz Scholarship"
            title="Who it is for, how much, and how to apply"
            body="University students in Uzbekistan can apply for funding toward tuition. See the award, eligibility, timeline, and a step by step guide."
            cta="Read the guide"
          />
          <TeaserCard
            href="/resources"
            eyebrow="Resources"
            title="Tools to learn, apply, and find funding"
            body="A handpicked library of free learning platforms, scholarship search tools, and guides to help students go further."
            cta="Browse resources"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-brand-600 px-8 py-14 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold">Ready to change a life?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">
            Whether you want to fund a student or you are a student seeking support,
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

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
        ✓
      </span>
      <span className="text-slate-600">
        <span className="font-semibold text-ink">{title}.</span> {children}
      </span>
    </li>
  );
}

function TeaserCard({
  href,
  eyebrow,
  title,
  body,
  cta,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-bold text-ink">{title}</h3>
      <p className="mt-3 flex-1 text-slate-600">{body}</p>
      <span className="mt-5 font-semibold text-brand-700 group-hover:underline">{cta}</span>
    </Link>
  );
}
