import type { Metadata } from "next";
import { StudentCard } from "@/components/StudentCard";
import { getPublicStudents } from "@/lib/students";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse students",
  description: "Browse verified students seeking educational funding and contribute to their goals.",
};

export default async function StudentsPage() {
  const students = await getPublicStudents().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-ink">Students seeking support</h1>
        <p className="mt-2 text-muted">
          Each student below has been reviewed and approved. Choose someone to support and
          fund any amount toward their education goal.
        </p>
      </header>

      {students.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => (
            <StudentCard key={s.id} student={s} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-muted">
          No approved students are listed yet. Please check back soon.
        </p>
      )}
    </div>
  );
}
