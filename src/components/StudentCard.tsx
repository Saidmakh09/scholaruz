import Link from "next/link";
import { formatCents, fundedPercent } from "@/lib/money";
import { ProgressBar } from "./ui";
import { Avatar } from "./Avatar";
import type { StudentWithProgress } from "@/lib/students";

export function StudentCard({ student }: { student: StudentWithProgress }) {
  const pct = fundedPercent(student.raisedCents, student.goalAmountCents);

  return (
    <Link
      href={`/students/${student.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <Avatar name={student.fullName} imageUrl={student.imageUrl} />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink group-hover:text-brand-700">
            {student.fullName}
          </h3>
          <p className="truncate text-sm text-muted">
            {student.fieldOfStudy} · {student.yearOfStudy}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-600">{student.school}</p>
      <p className="mt-1 text-xs text-muted">
        {student.city}, {student.country}
      </p>

      <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600">{student.story}</p>

      <div className="mt-4">
        <ProgressBar percent={pct} />
        <div className="mt-2 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-brand-700">
            {formatCents(student.raisedCents)}
          </span>
          <span className="text-muted">of {formatCents(student.goalAmountCents)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {pct}% funded · {student.donorCount} {student.donorCount === 1 ? "donor" : "donors"}
        </p>
      </div>
    </Link>
  );
}
