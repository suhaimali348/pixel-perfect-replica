import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/pms/DataPage";
import { users, inr } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/users")({
  head: seo("Users", "Clinic staff accounts."),
  component: UsersPage,
});

function UsersPage() {
  return (
    <DataPage
      title="Users"
      subtitle="Clinic staff accounts."
      rows={users}
      createLabel="Invite user"
      createPermission="admin.manage"
      columns={[
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "branch", label: "Branch" },
      { key: "status", label: "Status" },
    ]}
    />
  );
}
