import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { followups, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/followups")({
  head: seo("Follow-ups", "Track due and overdue patient follow-ups."),
  component: FollowupsPage,
});

function FollowupsPage() {
  return (
    <DataPage
      title="Follow-ups"
      subtitle="Track due and overdue patient follow-ups."
      rows={followups}
      createLabel="Schedule follow-up"
      createPermission="appointments.create"
      columns={[
      { key: "id", label: "ID" },
      { key: "patient", label: "Patient" },
      { key: "due", label: "Due date" },
      { key: "doctor", label: "Doctor" },
      { key: "reason", label: "Reason" },
      { key: "status", label: "Status" },
    ]}
    />
  );
}
