import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { auditLogs, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/audit-logs")({
  head: seo("Audit logs", "Who did what, and when."),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  return (
    <DataPage
      title="Audit logs"
      subtitle="Who did what, and when."
      rows={auditLogs}
      columns={[
      { key: "time", label: "Time" },
      { key: "user", label: "User" },
      { key: "action", label: "Action" },
      { key: "entity", label: "Entity" },
      { key: "ref", label: "Reference" },
      { key: "ip", label: "IP" },
    ]}
    />
  );
}
