import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { consultations } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/consultations/")({
  head: seo("Consultations", "All consultation records."),
  component: ConsultationsPage,
});

function ConsultationsPage() {
  const navigate = useNavigate();
  return (
    <DataPage
      title="Consultations"
      subtitle="All consultation records."
      rows={consultations}
      createLabel="New consultation"
      createPermission="consultations.create"
      onCreate={() => navigate({ to: "/consultations/new" })}
      columns={[
        { key: "id", label: "ID" },
        { key: "date", label: "Date" },
        { key: "patient", label: "Patient" },
        { key: "doctor", label: "Doctor" },
        { key: "diagnosis", label: "Diagnosis" },
        { key: "remedy", label: "Remedy" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
