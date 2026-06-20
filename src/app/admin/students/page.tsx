import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { Badge, buttonClass } from "@/components/ui";
import { studentStatusMeta } from "@/lib/labels";
import { setStudentStatusAction } from "@/app/actions/admin";
import type { StudentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Students" };

const STATUS_OPTIONS: StudentStatus[] = ["PENDING_REVIEW", "APPROVED", "FUNDED", "ARCHIVED"];

export default async function AdminStudentsPage() {
  const students = await prisma.studentProfile.findMany({
    include: {
      user: { select: { email: true } },
      contributions: { select: { amountCents: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-ink">Students</h2>
      <p className="mt-1 text-sm text-muted">
        Review applications and control which students are visible to donors.
      </p>

      {students.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-muted">
          No student profiles yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {students.map((s) => {
            const raised = s.contributions
              .filter((c) => c.status === "SUCCEEDED")
              .reduce((acc, c) => acc + c.amountCents, 0);
            const meta = studentStatusMeta[s.status];
            return (
              <div
                key={s.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{s.fullName}</h3>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {s.fieldOfStudy} · {s.school}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{s.user.email}</p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold text-brand-700">{formatCents(raised)}</span>
                    <span className="text-muted"> raised of {formatCents(s.goalAmountCents)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(s.status === "APPROVED" || s.status === "FUNDED") && (
                    <Link
                      href={`/students/${s.id}`}
                      className="text-sm font-medium text-accent-700 hover:underline"
                    >
                      View
                    </Link>
                  )}
                  <form action={setStudentStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="studentId" value={s.id} />
                    <select
                      name="status"
                      defaultValue={s.status}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {studentStatusMeta[opt].label}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className={buttonClass("outline", "sm")}>
                      Update
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
