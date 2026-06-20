import "server-only";
import { prisma } from "./db";

// Reconciliation: money that comes IN (succeeded contributions) must be
// tracked against money that goes OUT (disbursements to students). The admin
// dashboard uses these aggregates to keep the books transparent.

export type StudentLedger = {
  studentId: string;
  fullName: string;
  goalCents: number;
  raisedCents: number; // succeeded contributions
  pledgedPendingCents: number; // contributions still pending
  scheduledCents: number; // disbursements scheduled but not yet sent
  disbursedCents: number; // funds sent or confirmed
  heldBalanceCents: number; // raised - disbursed (funds held for the student)
  availableToDisburseCents: number; // raised - (scheduled + disbursed)
  overDisbursed: boolean; // disbursed > raised → needs attention
};

export type PlatformTotals = {
  raisedCents: number;
  pendingCents: number;
  disbursedCents: number;
  heldBalanceCents: number;
  studentCount: number;
  donorCount: number;
  contributionCount: number;
  disbursementCount: number;
  reconciled: boolean; // every student's books balance (no over-disbursement)
};

/** A disbursement counts as "out the door" once it is SENT or CONFIRMED. */
const DISBURSED_STATES = ["SENT", "CONFIRMED"] as const;

export async function getStudentLedgers(): Promise<StudentLedger[]> {
  const students = await prisma.studentProfile.findMany({
    select: {
      id: true,
      fullName: true,
      goalAmountCents: true,
      contributions: { select: { amountCents: true, status: true } },
      disbursements: { select: { amountCents: true, status: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return students.map((s) => {
    const raisedCents = sum(
      s.contributions.filter((c) => c.status === "SUCCEEDED").map((c) => c.amountCents),
    );
    const pledgedPendingCents = sum(
      s.contributions.filter((c) => c.status === "PENDING").map((c) => c.amountCents),
    );
    const disbursedCents = sum(
      s.disbursements
        .filter((d) => (DISBURSED_STATES as readonly string[]).includes(d.status))
        .map((d) => d.amountCents),
    );
    const scheduledCents = sum(
      s.disbursements.filter((d) => d.status === "SCHEDULED").map((d) => d.amountCents),
    );
    return {
      studentId: s.id,
      fullName: s.fullName,
      goalCents: s.goalAmountCents,
      raisedCents,
      pledgedPendingCents,
      scheduledCents,
      disbursedCents,
      heldBalanceCents: raisedCents - disbursedCents,
      availableToDisburseCents: raisedCents - scheduledCents - disbursedCents,
      overDisbursed: disbursedCents > raisedCents,
    };
  });
}

export async function getPlatformTotals(): Promise<PlatformTotals> {
  const [ledgers, donorCount, contributionCount, disbursementCount] = await Promise.all([
    getStudentLedgers(),
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.contribution.count(),
    prisma.disbursement.count(),
  ]);

  const raisedCents = sum(ledgers.map((l) => l.raisedCents));
  const pendingCents = sum(ledgers.map((l) => l.pledgedPendingCents));
  const disbursedCents = sum(ledgers.map((l) => l.disbursedCents));

  return {
    raisedCents,
    pendingCents,
    disbursedCents,
    heldBalanceCents: raisedCents - disbursedCents,
    studentCount: ledgers.length,
    donorCount,
    contributionCount,
    disbursementCount,
    reconciled: ledgers.every((l) => !l.overDisbursed),
  };
}

function sum(values: number[]): number {
  return values.reduce((acc, n) => acc + n, 0);
}
