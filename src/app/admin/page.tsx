import type { Metadata } from "next";
import { getPlatformTotals, getStudentLedgers } from "@/lib/reconciliation";
import { formatCents } from "@/lib/money";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Overview" };

export default async function AdminOverviewPage() {
  const [totals, ledgers] = await Promise.all([getPlatformTotals(), getStudentLedgers()]);

  return (
    <div>
      {/* Reconciliation banner */}
      <div
        className={`rounded-2xl border p-5 ${
          totals.reconciled
            ? "border-brand-200 bg-brand-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{totals.reconciled ? "✅" : "⚠️"}</span>
          <div>
            <p className="font-semibold text-ink">
              {totals.reconciled ? "Books are reconciled" : "Reconciliation needs attention"}
            </p>
            <p className="text-sm text-muted">
              {totals.reconciled
                ? "Every student's disbursements are within funds raised."
                : "One or more students have been disbursed more than they have raised."}
            </p>
          </div>
        </div>
      </div>

      {/* Money totals */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total raised" value={formatCents(totals.raisedCents)} tone="green" />
        <StatCard label="Disbursed" value={formatCents(totals.disbursedCents)} tone="blue" />
        <StatCard
          label="Held balance"
          value={formatCents(totals.heldBalanceCents)}
          tone="slate"
          hint="Raised minus disbursed"
        />
        <StatCard
          label="Pending pledges"
          value={formatCents(totals.pendingCents)}
          tone="amber"
          hint="Awaiting payment"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat label="Students" value={totals.studentCount} />
        <MiniStat label="Donors" value={totals.donorCount} />
        <MiniStat label="Contributions" value={totals.contributionCount} />
        <MiniStat label="Disbursements" value={totals.disbursementCount} />
      </div>

      {/* Per-student ledger */}
      <h2 className="mt-10 text-xl font-bold text-ink">Per-student ledger</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white scroll-thin">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3 text-right">Goal</th>
              <th className="px-4 py-3 text-right">Raised</th>
              <th className="px-4 py-3 text-right">Disbursed</th>
              <th className="px-4 py-3 text-right">Held</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No students yet.
                </td>
              </tr>
            ) : (
              ledgers.map((l) => (
                <tr key={l.studentId}>
                  <td className="px-4 py-3 font-medium text-ink">{l.fullName}</td>
                  <td className="px-4 py-3 text-right text-muted">{formatCents(l.goalCents)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-700">
                    {formatCents(l.raisedCents)}
                  </td>
                  <td className="px-4 py-3 text-right text-accent-700">
                    {formatCents(l.disbursedCents)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCents(l.heldBalanceCents)}
                  </td>
                  <td className="px-4 py-3">
                    {l.overDisbursed ? (
                      <Badge tone="red">Over-disbursed</Badge>
                    ) : l.raisedCents >= l.goalCents ? (
                      <Badge tone="blue">Goal met</Badge>
                    ) : (
                      <Badge tone="green">On track</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone: "green" | "blue" | "slate" | "amber";
  hint?: string;
}) {
  const tones: Record<string, string> = {
    green: "text-brand-700",
    blue: "text-accent-700",
    slate: "text-ink",
    amber: "text-amber-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className={`text-2xl font-bold ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-lg font-bold text-ink">{value}</span>{" "}
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
