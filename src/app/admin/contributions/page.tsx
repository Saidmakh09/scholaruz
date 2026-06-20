import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { Badge } from "@/components/ui";
import { contributionStatusMeta } from "@/lib/labels";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Contributions" };

export default async function AdminContributionsPage() {
  const contributions = await prisma.contribution.findMany({
    include: {
      donor: { select: { name: true, email: true } },
      student: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const succeededTotal = contributions
    .filter((c) => c.status === "SUCCEEDED")
    .reduce((acc, c) => acc + c.amountCents, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-ink">Contributions</h2>
          <p className="mt-1 text-sm text-muted">Every pledge and its payment status.</p>
        </div>
        <p className="text-sm text-muted">
          Confirmed total:{" "}
          <span className="font-semibold text-brand-700">{formatCents(succeededTotal)}</span>
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white scroll-thin">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contributions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No contributions yet.
                </td>
              </tr>
            ) : (
              contributions.map((c) => {
                const meta = contributionStatusMeta[c.status];
                return (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-ink">{c.donor.name}</span>
                      <span className="block text-xs text-slate-400">{c.donor.email}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{c.student.fullName}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCents(c.amountCents)}
                    </td>
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
