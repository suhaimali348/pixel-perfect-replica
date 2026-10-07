import { useMemo, useState, type ReactNode } from "react";
import { Search, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
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
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{actions}</div>
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
  const [data, setData] = useState(rows);
  const [editing, setEditing] = useState<{ row: T; draft: Record<string, string> } | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const editPerm = createPermission?.replace(".create", ".edit") as Permission | undefined;
  const delPerm = createPermission?.replace(".create", ".delete") as Permission | undefined;
  const canEdit = !!createPermission && can(editPerm!) || (!!createPermission && can(createPermission) && editPerm === createPermission);
  const canDelete = !!createPermission && (can(delPerm!) || (delPerm === createPermission && can(createPermission)));
  const showActions = canEdit || canDelete;
  const filtered = useMemo(
    () => data.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase())),
    [data, q],
  );
  const editable = columns.filter((c) => typeof data[0]?.[c.key] === "string" || typeof data[0]?.[c.key] === "number");
  const saveEdit = () => {
    if (!editing) return;
    const updated = { ...editing.row } as Record<string, unknown>;
    editable.forEach((c) => {
      const v = editing.draft[c.key];
      updated[c.key] = typeof editing.row[c.key] === "number" ? Number(v) || 0 : v;
    });
    setData((d) => d.map((r) => (r === editing.row ? (updated as T) : r)));
    setEditing(null);
    toast.success("Record updated");
  };
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
              <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}{showActions && <th className="px-4 py-3 text-right font-semibold">Actions</th>}</tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-t transition-colors hover:bg-accent/50">
                  {columns.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-4 py-3">
                      {c.render ? c.render(r) : c.key === "status" ? <StatusBadge value={String(r[c.key])} /> : String(r[c.key] ?? "")}
                    </td>
                  ))}
                  {showActions && (
                    <td className="whitespace-nowrap px-4 py-2 text-right">
                      {canEdit && <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing({ row: r, draft: Object.fromEntries(editable.map((c) => [c.key, String(r[c.key] ?? "")])) })}><Pencil className="size-4" /></Button>}
                      {canDelete && <Button size="icon" variant="ghost" aria-label="Delete" className="text-destructive hover:text-destructive" onClick={() => setDeleting(r)}><Trash2 className="size-4" /></Button>}
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={columns.length + (showActions ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">No matching records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit record</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {editing && editable.map((c) => (
              <div key={c.key} className="space-y-1.5">
                <Label htmlFor={`e-${c.key}`}>{c.label}</Label>
                <Input id={`e-${c.key}`} value={editing.draft[c.key] ?? ""} onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [c.key]: e.target.value } })} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setData((d) => d.filter((r) => r !== deleting)); setDeleting(null); toast.success("Record deleted"); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
