import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { payments, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/payments")({
  head: seo("Payments", "Payments received against invoices."),
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <DataPage
      title="Payments"
      subtitle="Payments received against invoices."
      rows={payments}
      createLabel="Record payment"
      createPermission="billing.create"
      columns={[
      { key: "id", label: "ID" },
      { key: "date", label: "Date" },
      { key: "invoice", label: "Invoice" },
      { key: "patient", label: "Patient" },
      { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
      { key: "method", label: "Method" },
    ]}
    />
  );
}
