import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentById } from "@/lib/students";
import { getSessionUser } from "@/lib/auth";
import { formatCents, fundedPercent } from "@/lib/money";
import { Avatar } from "@/components/Avatar";
import { Badge, ProgressBar } from "@/components/ui";
import { FundForm } from "@/components/FundForm";
import { studentStatusMeta } from "@/lib/labels";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ canceled?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudentById(id).catch(() => null);
  if (!student) return { title: "Student not found" };
  return {
    title: `Support ${student.fullName}`,
    description: `${student.fullName} is studying ${student.fieldOfStudy} at ${student.school}. Help fund their education.`,
  };
}

export default async function StudentDetailPage({ params, searchParams }: Params) {
  const { id } = await params;
  const { canceled } = await searchParams;

  const [student, user] = await Promise.all([
    getStudentById(id).catch(() => null),
    getSessionUser(),
  ]);

  if (!student || (student.status !== "APPROVED" && student.status !== "FUNDED")) {
    notFound();
  }

  const pct = fundedPercent(student.raisedCents, student.goalAmountCents);
  const meta = studentStatusMeta[student.status];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/students" className="text-sm font-medium text-brand-700 hover:underline">
        ← All students
      </Link>

      {canceled && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your contribution was canceled. You can try again whenever you&apos;re ready.
        </p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Main */}
        <div>
          <div className="flex items-center gap-4">
            <Avatar name={student.fullName} imageUrl={student.imageUrl} size="lg" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-ink">{student.fullName}</h1>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
              <p className="mt-1 text-muted">
                {student.fieldOfStudy} · {student.yearOfStudy}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <Detail term="School" value={student.school} />
            <Detail term="Location" value={`${student.city}, ${student.country}`} />
            <Detail term="Field of study" value={student.fieldOfStudy} />
            <Detail term="Year" value={student.yearOfStudy} />
          </dl>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-ink">Their story</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
              {student.story}
            </p>
          </section>
        </div>

        {/* Funding sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-brand-700">{formatCents(student.raisedCents)}</p>
            <p className="text-sm text-muted">raised of {formatCents(student.goalAmountCents)} goal</p>
            <div className="mt-3">
              <ProgressBar percent={pct} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {pct}% funded · {student.donorCount}{" "}
              {student.donorCount === 1 ? "donor" : "donors"}
            </p>
          </div>

          <FundForm
            studentId={student.id}
            isAuthed={Boolean(user)}
            fullyFunded={student.status === "FUNDED"}
          />
        </aside>
      </div>
    </div>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{term}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
