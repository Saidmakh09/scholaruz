import type { Metadata } from "next";
import { LinkButton } from "@/components/ui";
import { CoverImage } from "@/components/CoverImage";
import { uz } from "@/lib/images";

export const metadata: Metadata = {
  title: "The ScholarUz Scholarship",
  description:
    "How the ScholarUz Scholarship works: who can apply, how much you can receive, when funding is available, and a step by step guide to applying.",
};

export default function ScholarshipPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <CoverImage src={uz.poiKalon.src} alt={uz.poiKalon.alt} priority className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/85 via-accent-900/65 to-accent-900/30" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-24 text-white sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/30">
              The ScholarUz Scholarship
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Support that keeps you in university
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              The ScholarUz Scholarship is funded by donors from around the world. It helps
              university students in Uzbekistan cover tuition and study costs so that money is
              never the reason a talented student has to stop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/register" size="lg">
                Apply as a student
              </LinkButton>
              <LinkButton
                href="/students"
                variant="outline"
                size="lg"
                className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20"
              >
                Support a student
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:grid-cols-3">
          <Fact label="Award amount" value="$500 to $5,000" hint="Per student, toward tuition" />
          <Fact label="Who it is for" value="University students" hint="Enrolled and in need" />
          <Fact label="When to apply" value="Open year round" hint="Reviewed every semester" />
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Eyebrow>Overview</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-ink">How the scholarship works</h2>
        <p className="mt-4 text-lg text-slate-600">
          ScholarUz is not a single fund with one deadline. It is a living platform. Students
          create a profile that tells their story, donors choose who to support, and
          contributions are pooled into a scholarship that is paid toward each student&apos;s
          university. You can apply at any time, and your profile stays live until your goal is
          met.
        </p>
      </section>

      {/* The award */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <Eyebrow>The award</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold text-ink">What you can receive</h2>
            <p className="mt-4 text-slate-600">
              Each student sets a funding goal that reflects their real need. Scholarships
              typically range from $500 to $5,000, paid directly toward tuition and university
              fees. There is no cost to apply, and students never repay the funds. A scholarship
              is a gift from donors who believe in you.
            </p>
            <ul className="mt-6 space-y-3">
              <Bullet>Funds go toward tuition and required university costs.</Bullet>
              <Bullet>Money is sent to your institution, not paid out as cash.</Bullet>
              <Bullet>Every disbursement is tracked and reconciled openly.</Bullet>
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-md">
            <CoverImage src={uz.khiva.src} alt={uz.khiva.alt} className="h-80 w-full" />
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Eyebrow>Eligibility</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-ink">Who can apply</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          The scholarship is open to university students who need support to continue their
          studies. To apply, you should be:
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <EligibilityCard title="Enrolled at a university">
            You are currently studying, or about to start, at an accredited university or
            institute, most often in Uzbekistan.
          </EligibilityCard>
          <EligibilityCard title="In genuine financial need">
            Your studies are at risk because of the cost of tuition, housing, or materials.
          </EligibilityCard>
          <EligibilityCard title="Committed to your studies">
            You are in good academic standing and serious about finishing your degree.
          </EligibilityCard>
          <EligibilityCard title="Ready to share your story">
            You are willing to tell donors who you are, what you study, and what funding would
            change for you.
          </EligibilityCard>
        </div>
      </section>

      {/* How to apply */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Eyebrow>How to apply</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-ink">Your step by step guide</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Step n={1} title="Create your account">
              Sign up for a free student account in under a minute. No fees, ever.
            </Step>
            <Step n={2} title="Build your profile">
              Add your school, field of study, funding goal, and the story behind your need.
            </Step>
            <Step n={3} title="Submit for review">
              Send your profile to our team. We check the details before it goes public.
            </Step>
            <Step n={4} title="Get approved">
              Once verified, your profile goes live and donors can start contributing.
            </Step>
            <Step n={5} title="Receive funding">
              As contributions arrive, you watch your goal fill up in real numbers.
            </Step>
            <Step n={6} title="Funds reach your school">
              We disburse the scholarship to your university and confirm it was received.
            </Step>
          </div>
          <div className="mt-10">
            <LinkButton href="/register" size="lg">
              Start your application
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Eyebrow>Timeline</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-ink">When funding is available</h2>
        <p className="mt-4 text-slate-600">
          Applications are open all year and reviewed on a rolling basis, so you never have to
          wait for a single deadline. Funding rounds follow the academic calendar:
        </p>
        <div className="mt-6 space-y-4">
          <TimelineRow term="Fall round" detail="Apply from August. Funding reviewed through December." />
          <TimelineRow term="Spring round" detail="Apply from January. Funding reviewed through May." />
          <TimelineRow term="Any time" detail="Submit whenever you are ready. Approved profiles stay live until funded." />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-ink">Frequently asked</h2>
          <div className="mt-8 divide-y divide-slate-200">
            <Faq q="How much can I receive?">
              Most scholarships range from $500 to $5,000, depending on the goal you set and how
              many donors choose to support you.
            </Faq>
            <Faq q="Is it really free to apply?">
              Yes. Applying is completely free, and a scholarship is a gift. Students never repay
              the funds they receive.
            </Faq>
            <Faq q="When will I get funded?">
              It depends on donor interest. Some students reach their goal quickly, others over a
              semester. Your profile stays live until you are fully funded.
            </Faq>
            <Faq q="How is the money sent?">
              Funds are disbursed to your university or institution toward tuition and fees, not
              paid to you in cash. Every disbursement is recorded and reconciled.
            </Faq>
            <Faq q="Who can see my information?">
              Donors see the profile you choose to share: your name, school, field, goal, and
              story. Your account details and password are always private.
            </Faq>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-brand-600 px-8 py-14 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold">Your education should not wait</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">
            Create your profile today and let donors help you reach graduation.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <LinkButton href="/register" variant="accent" size="lg">
              Apply now
            </LinkButton>
            <LinkButton
              href="/resources"
              variant="outline"
              size="lg"
              className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20"
            >
              Explore resources
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{children}</p>
  );
}

function Fact({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-slate-600">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function EligibilityCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
        {n}
      </div>
      <h3 className="mt-4 font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  );
}

function TimelineRow({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:gap-6">
      <span className="w-32 shrink-0 font-semibold text-brand-700">{term}</span>
      <span className="text-slate-600">{detail}</span>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="py-5">
      <h3 className="font-semibold text-ink">{q}</h3>
      <p className="mt-2 text-slate-600">{children}</p>
    </div>
  );
}
