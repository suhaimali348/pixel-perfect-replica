import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { branches, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/branches")({
  head: seo("Branches", "Clinic locations."),
  component: BranchesPage,
});

function BranchesPage() {
  return (
    <DataPage
      title="Branches"
      subtitle="Clinic locations."
      rows={branches}
      createLabel="Add branch"
      createPermission="admin.manage"
      columns={[
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "address", label: "Address" },
      { key: "phone", label: "Phone" },
      { key: "doctors", label: "Doctors" },
      { key: "patients", label: "Patients" },
    ]}
    />
  );
}
