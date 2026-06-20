import type { ContributionStatus, DisbursementStatus, StudentStatus } from "@prisma/client";

type Tone = "slate" | "green" | "blue" | "amber" | "red";

export const studentStatusMeta: Record<StudentStatus, { label: string; tone: Tone }> = {
  PENDING_REVIEW: { label: "Pending review", tone: "amber" },
  APPROVED: { label: "Approved", tone: "green" },
  FUNDED: { label: "Fully funded", tone: "blue" },
  ARCHIVED: { label: "Archived", tone: "slate" },
};

export const contributionStatusMeta: Record<ContributionStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "amber" },
  SUCCEEDED: { label: "Succeeded", tone: "green" },
  FAILED: { label: "Failed", tone: "red" },
  REFUNDED: { label: "Refunded", tone: "slate" },
};

export const disbursementStatusMeta: Record<DisbursementStatus, { label: string; tone: Tone }> = {
  SCHEDULED: { label: "Scheduled", tone: "amber" },
  SENT: { label: "Sent", tone: "blue" },
  CONFIRMED: { label: "Confirmed", tone: "green" },
};
