import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/pms/DataPage";
import { PERMISSIONS, ROLE_PERMISSIONS, type Role } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/roles")({
  head: seo("Roles & permissions", "Granular permission matrix for each staff role."),
  component: Roles,
});

function Roles() {
  const roles = Object.keys(ROLE_PERMISSIONS) as Role[];
  return (
    <div>
      <PageHeader title="Roles & permissions" subtitle="Each role is a set of granular permissions." />
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Permission</th>{roles.map((r) => <th key={r} className="px-3 py-3">{r}</th>)}</tr></thead>
          <tbody>{PERMISSIONS.map((p) => (
            <tr key={p} className="border-t"><td className="px-4 py-2 font-mono text-xs">{p}</td>
              {roles.map((r) => <td key={r} className="px-3 py-2 text-center">{ROLE_PERMISSIONS[r].includes(p) ? <Check className="mx-auto size-4 text-success" /> : <span className="text-muted-foreground">—</span>}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
