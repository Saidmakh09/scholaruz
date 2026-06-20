import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getStudentLedgers } from "@/lib/reconciliation";
import { formatCents } from "@/lib/money";
import { Badge, buttonClass } from "@/components/ui";
import { disbursementStatusMeta } from "@/lib/labels";
import { DisbursementForm } from "@/components/DisbursementForm";
import { advanceDisbursementAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Disbursements" };

export default async function AdminDisbursementsPage() {
  const [ledgers, disbursements] = await Promise.all([
    getStudentLedgers(),
    prisma.disbursement.findMany({
      include: { student: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const options = ledgers.map((l) => ({
    id: l.studentId,
    name: l.fullName,
    heldCents: l.availableToDisburseCents,
  }));

  return (
    <div>
      <h2 className="text-xl font-bold text-ink">Disbursements</h2>
      <p className="mt-1 text-sm text-muted">
        Send pooled funds to students&apos; institutions and confirm receipt.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-ink">Schedule a disbursement</h3>
        <p className="mt-1 text-sm text-muted">
          You can only disburse up to a student&apos;s held balance (raised minus already sent).
        </p>
        <div className="mt-5">
          <DisbursementForm students={options} />
        </div>
      </div>

      <h3 className="mt-10 font-semibold text-ink">Disbursement history</h3>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white scroll-thin">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {disbursements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No disbursements yet.
                </td>
              </tr>
            ) : (
              disbursements.map((d) => {
                const meta = disbursementStatusMeta[d.status];
                return (
                  <tr key={d.id}>
                    <td className="px-4 py-3 font-medium text-ink">{d.student.fullName}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCents(d.amountCents)}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {d.reference || <span className="text-slate-300">none</span>}
                      {d.note && <span className="block text-xs text-slate-400">{d.note}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {d.status === "SCHEDULED" && (
                        <form action={advanceDisbursementAction}>
                          <input type="hidden" name="disbursementId" value={d.id} />
                          <input type="hidden" name="to" value="SENT" />
                          <button type="submit" className={buttonClass("accent", "sm")}>
                            Mark sent
                          </button>
                        </form>
                      )}
                      {d.status === "SENT" && (
                        <form action={advanceDisbursementAction}>
                          <input type="hidden" name="disbursementId" value={d.id} />
                          <input type="hidden" name="to" value="CONFIRMED" />
                          <button type="submit" className={buttonClass("primary", "sm")}>
                            Confirm receipt
                          </button>
                        </form>
                      )}
                      {d.status === "CONFIRMED" && (
                        <span className="text-xs text-muted">Reconciled</span>
                      )}
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
