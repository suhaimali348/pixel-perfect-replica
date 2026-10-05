import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { inr, invoices } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/billing")({
  head: seo("Billing", "Invoices for consultations and medicines."),
  component: Billing,
});

function Billing() {
  const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.total, 0);
  const due = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.total, 0);
  return (
    <DataPage
      title="Billing"
      subtitle="Invoices for consultations and medicines."
      rows={invoices}
      createLabel="New invoice"
      createPermission="billing.create"
      extra={
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          {[["Invoices", String(invoices.length)], ["Collected", inr(paid)], ["Outstanding", inr(due)]].map(([k, v]) => (
            <div key={k} className="surface-card p-4"><div className="text-xs text-muted-foreground">{k}</div><div className="mt-1 font-display text-2xl font-bold">{v}</div></div>
          ))}
        </div>
      }
      columns={[
        { key: "id", label: "Invoice" },
        { key: "date", label: "Date" },
        { key: "patient", label: "Patient" },
        { key: "consultation", label: "Consultation", render: (r) => inr(r.consultation) },
        { key: "medicines", label: "Medicines", render: (r) => inr(r.medicines) },
        { key: "discount", label: "Discount", render: (r) => inr(r.discount) },
        { key: "total", label: "Total", render: (r) => <b>{inr(r.total)}</b> },
        { key: "method", label: "Method" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
