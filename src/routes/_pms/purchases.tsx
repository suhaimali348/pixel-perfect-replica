import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { purchases, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/purchases")({
  head: seo("Purchases", "Purchase orders and goods received."),
  component: PurchasesPage,
});

function PurchasesPage() {
  return (
    <DataPage
      title="Purchases"
      subtitle="Purchase orders and goods received."
      rows={purchases}
      createLabel="New purchase order"
      createPermission="inventory.create"
      columns={[
      { key: "id", label: "PO #" },
      { key: "date", label: "Date" },
      { key: "supplier", label: "Supplier" },
      { key: "items", label: "Items" },
      { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
      { key: "status", label: "Status" },
    ]}
    />
  );
}
