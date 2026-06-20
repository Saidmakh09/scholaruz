import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatCents, fundedPercent } from "@/lib/money";
import { Badge, ProgressBar, LinkButton } from "@/components/ui";
import { contributionStatusMeta, studentStatusMeta } from "@/lib/labels";
import { StudentProfileForm, type ProfileDefaults } from "@/components/StudentProfileForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");

  return user.role === "STUDENT" ? (
    <StudentDashboard userId={user.id} name={user.name} />
  ) : (
    <DonorDashboard userId={user.id} name={user.name} />
  );
}

async function DonorDashboard({ userId, name }: { userId: string; name: string }) {
  const contributions = await prisma.contribution.findMany({
    where: { donorUserId: userId },
    include: { student: { select: { id: true, fullName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const succeeded = contributions.filter((c) => c.status === "SUCCEEDED");
  const totalGiven = succeeded.reduce((acc, c) => acc + c.amountCents, 0);
  const studentsSupported = new Set(succeeded.map((c) => c.studentId)).size;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Welcome, {name.split(" ")[0]}</h1>
      <p className="mt-1 text-muted">Your giving at a glance.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total contributed" value={formatCents(totalGiven)} />
        <SummaryCard label="Students supported" value={String(studentsSupported)} />
        <SummaryCard label="Contributions" value={String(succeeded.length)} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink">Your contributions</h2>
        <LinkButton href="/students" size="sm">
          Fund another student
        </LinkButton>
      </div>

      {contributions.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-muted">
          You haven&apos;t made any contributions yet.{" "}
          <Link href="/students" className="font-semibold text-brand-700 hover:underline">
            Browse students
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contributions.map((c) => {
                const meta = contributionStatusMeta[c.status];
                return (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/students/${c.student.id}`}
                        className="font-medium text-ink hover:text-brand-700"
                      >
                        {c.student.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCents(c.amountCents)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

async function StudentDashboard({ userId, name }: { userId: string; name: string }) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { contributions: { select: { amountCents: true, status: true, donorUserId: true } } },
  });

  const raised =
    profile?.contributions
      .filter((c) => c.status === "SUCCEEDED")
      .reduce((acc, c) => acc + c.amountCents, 0) ?? 0;
  const donors = new Set(
    profile?.contributions.filter((c) => c.status === "SUCCEEDED").map((c) => c.donorUserId),
  ).size;

  const defaults: ProfileDefaults = {
    fullName: profile?.fullName ?? name,
    school: profile?.school ?? "",
    fieldOfStudy: profile?.fieldOfStudy ?? "",
    yearOfStudy: profile?.yearOfStudy ?? "",
    city: profile?.city ?? "",
    country: profile?.country ?? "Uzbekistan",
    story: profile?.story ?? "",
    goalDollars: profile ? String(profile.goalAmountCents / 100) : "",
    imageUrl: profile?.imageUrl ?? "",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Welcome, {name.split(" ")[0]}</h1>

      {profile ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">Application status:</span>
              <Badge tone={studentStatusMeta[profile.status].tone}>
                {studentStatusMeta[profile.status].label}
              </Badge>
            </div>
            {(profile.status === "APPROVED" || profile.status === "FUNDED") && (
              <Link
                href={`/students/${profile.id}`}
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                View public profile →
              </Link>
            )}
          </div>

          <div className="mt-5">
            <ProgressBar percent={fundedPercent(raised, profile.goalAmountCents)} />
            <div className="mt-2 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-brand-700">{formatCents(raised)}</span>
              <span className="text-muted">
                of {formatCents(profile.goalAmountCents)} · {donors}{" "}
                {donors === 1 ? "donor" : "donors"}
              </span>
            </div>
          </div>

          {profile.status === "PENDING_REVIEW" && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Your profile is awaiting admin review. You can keep editing it below.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-muted">
          Set up your profile so donors can support your education. It will be reviewed by an
          admin before going live.
        </p>
      )}

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-ink">
          {profile ? "Edit your profile" : "Create your profile"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          The more donors know about you, the more likely they are to give.
        </p>
        <div className="mt-6">
          <StudentProfileForm defaults={defaults} isNew={!profile} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
