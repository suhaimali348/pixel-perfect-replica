import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { suppliers, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/suppliers")({
  head: seo("Suppliers", "Medicine suppliers and outstanding balances."),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <DataPage
      title="Suppliers"
      subtitle="Medicine suppliers and outstanding balances."
      rows={suppliers}
      createLabel="Add supplier"
      createPermission="inventory.create"
      columns={[
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "contact", label: "Contact" },
      { key: "phone", label: "Phone" },
      { key: "city", label: "City" },
      { key: "outstanding", label: "Outstanding", render: (r) => inr(r.outstanding) },
    ]}
    />
  );
}
