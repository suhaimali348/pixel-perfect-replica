import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { remedies } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/medicines")({
  head: seo("Remedy master", "Remedies, abbreviations, kingdoms and available potencies."),
  component: Medicines,
});

function Medicines() {
  return (
    <DataPage
      title="Remedy master"
      subtitle="Remedies, abbreviations, kingdoms and available potencies."
      rows={remedies}
      createLabel="Add remedy"
      createPermission="inventory.create"
      columns={[
        { key: "name", label: "Remedy" },
        { key: "abbr", label: "Abbreviation" },
        { key: "kingdom", label: "Kingdom" },
        { key: "potencies", label: "Potencies", render: (r) => r.potencies.join(", ") },
        { key: "stock", label: "Total stock" },
      ]}
    />
  );
}
