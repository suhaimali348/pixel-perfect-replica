import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { patients } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/patients/")({
  head: seo("Patients", "Search and manage registered patients."),
  component: PatientsPage,
});

function PatientsPage() {
  const navigate = useNavigate();
  return (
    <DataPage
      title="Patients"
      subtitle="Search and manage registered patients."
      rows={patients}
      createLabel="Register patient"
      createPermission="patients.create"
      onCreate={() => navigate({ to: "/patients/new" })}
      columns={[
        { key: "id", label: "ID", render: (r) => <Link to="/patients/$id" params={{ id: r.id }} className="font-medium text-primary hover:underline">{r.id}</Link> },
        { key: "name", label: "Name" },
        { key: "age", label: "Age" },
        { key: "gender", label: "Gender" },
        { key: "phone", label: "Phone" },
        { key: "complaint", label: "Chief complaint" },
        { key: "lastVisit", label: "Last visit" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
