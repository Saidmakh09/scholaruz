import { requireRole } from "@/lib/auth";
import { AdminTabs } from "@/components/AdminTabs";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Admin</p>
        <h1 className="text-3xl font-bold text-ink">Reconciliation console</h1>
        <p className="mt-1 text-muted">
          Track contribution status, student funding, and disbursement state across the platform.
        </p>
      </div>
      <AdminTabs />
      <div className="mt-8">{children}</div>
    </div>
  );
}
