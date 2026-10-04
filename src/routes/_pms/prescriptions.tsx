import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { prescriptions, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/prescriptions")({
  head: seo("Prescriptions", "Prescribed remedies, potencies and dosage."),
  component: PrescriptionsPage,
});

function PrescriptionsPage() {
  return (
    <DataPage
      title="Prescriptions"
      subtitle="Prescribed remedies, potencies and dosage."
      rows={prescriptions}
      createLabel="New prescription"
      createPermission="prescriptions.create"
      columns={[
      { key: "id", label: "Rx #" },
      { key: "date", label: "Date" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "remedy", label: "Remedy" },
      { key: "dosage", label: "Dosage" },
      { key: "duration", label: "Duration" },
      { key: "status", label: "Status" },
    ]}
    />
  );
}
