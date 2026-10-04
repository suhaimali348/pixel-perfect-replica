import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { appointments, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/appointments")({
  head: seo("Appointments", "Book and manage patient appointments."),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  return (
    <DataPage
      title="Appointments"
      subtitle="Book and manage patient appointments."
      rows={appointments}
      createLabel="New appointment"
      createPermission="appointments.create"
      columns={[
      { key: "id", label: "ID" },
      { key: "time", label: "Time" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "type", label: "Type" },
      { key: "status", label: "Status" },
    ]}
    />
  );
}
