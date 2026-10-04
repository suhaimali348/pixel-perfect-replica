import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { inventory, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/inventory")({
  head: seo("Inventory", "Stock by remedy, potency, batch and expiry."),
  component: InventoryPage,
});

function InventoryPage() {
  return (
    <DataPage
      title="Inventory"
      subtitle="Stock by remedy, potency, batch and expiry."
      rows={inventory}
      createLabel="Add stock"
      createPermission="inventory.create"
      columns={[
      { key: "sku", label: "SKU" },
      { key: "name", label: "Remedy" },
      { key: "potency", label: "Potency" },
      { key: "form", label: "Form" },
      { key: "batch", label: "Batch" },
      { key: "expiry", label: "Expiry" },
      { key: "qty", label: "Qty" },
      { key: "supplier", label: "Supplier" },
    ]}
    />
  );
}
