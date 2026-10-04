import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { consultations, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/consultations/")({
  head: seo("Consultations", "All consultation records."),
  component: ConsultationsPage,
});

function ConsultationsPage() {
  return (
    <DataPage
      title="Consultations"
      subtitle="All consultation records."
      rows={consultations}
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
