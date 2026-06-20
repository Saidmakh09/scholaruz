// All monetary values are stored as integer cents to avoid floating-point
// rounding errors. These helpers convert and format for display.

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100;
}

/** Percentage of goal reached, clamped to 0–100 and rounded to a whole number. */
export function fundedPercent(raisedCents: number, goalCents: number): number {
  if (goalCents <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((raisedCents / goalCents) * 100)));
}
