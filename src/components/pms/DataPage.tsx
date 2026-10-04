import { useMemo, useState, type ReactNode } from "react";
import { Search, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import type { Permission } from "@/lib/mock-data";

export type Column<T> = { key: keyof T & string; label: string; render?: (row: T) => ReactNode };

const statusTone: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Active: "success", Completed: "success", Paid: "success", Dispensed: "success", Received: "success",
  New: "info", Scheduled: "info", Upcoming: "info", Ordered: "info", "Checked in": "info",
  Pending: "warning", Partial: "warning", Due: "warning", Draft: "warning", "In consultation": "warning",
  Unpaid: "danger", Overdue: "danger", Cancelled: "danger", Inactive: "neutral",
};

export function StatusBadge({ value }: { value: string }) {
  return <Badge variant={statusTone[value] ?? "neutral"}>{value}</Badge>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}

export function DataPage<T extends Record<string, unknown>>({
  title, subtitle, rows, columns, createLabel, createPermission, onCreate, extra,
}: {
  title: string; subtitle?: string; rows: T[]; columns: Column<T>[];
  createLabel?: string; createPermission?: Permission; onCreate?: () => void; extra?: ReactNode;
}) {
  const { can } = useAuth();
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase())),
    [rows, q],
  );
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success(`${title} exported (sample)`)}>
              <Download className="size-4" /> Export
            </Button>
            {createLabel && (!createPermission || can(createPermission)) && (
              <Button onClick={onCreate ?? (() => toast.info("Connect your backend to save records"))}>
                <Plus className="size-4" /> {createLabel}
              </Button>
            )}
          </>
        }
      />
      {extra}
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 border-b p-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-t transition-colors hover:bg-accent/50">
                  {columns.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-4 py-3">
                      {c.render ? c.render(r) : c.key === "status" ? <StatusBadge value={String(r[c.key])} /> : String(r[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">No matching records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
