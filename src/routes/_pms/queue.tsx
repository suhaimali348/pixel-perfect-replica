import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, StatusBadge } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { queue as initial } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/queue")({
  head: seo("Patient queue", "Live token queue for today's patients."),
  component: Queue,
});

const flow = ["Scheduled", "Checked in", "In consultation", "Completed"];

function Queue() {
  const [q, setQ] = useState(initial);
  const advance = (id: string) => setQ((rows) => rows.map((r) => {
    if (r.id !== id) return r;
    const next = flow[Math.min(flow.indexOf(r.status) + 1, flow.length - 1)];
    toast.success(`${r.patient}: ${next}`);
    return { ...r, status: next };
  }));
  const current = q.find((r) => r.status === "In consultation");
  return (
    <div className="space-y-6">
      <PageHeader title="Patient queue" subtitle="Tap a patient to move them to the next stage." />
      <div className="surface-card flex items-center gap-6 bg-gradient-primary p-6 text-primary-foreground">
        <div className="font-display text-6xl font-extrabold">{current ? `#${current.token}` : "—"}</div>
        <div><div className="text-sm opacity-80">Now in consultation</div><div className="text-xl font-semibold">{current?.patient ?? "No one yet"}</div><div className="text-sm opacity-80">{current?.doctor}</div></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {q.map((r) => (
          <div key={r.id} className="surface-card flex items-center gap-4 p-4">
            <div className="grid size-12 place-items-center rounded-lg bg-primary/10 font-display text-lg font-bold text-primary">{r.token}</div>
            <div className="flex-1">
              <div className="font-medium">{r.patient}</div>
              <div className="text-xs text-muted-foreground">{r.time} · {r.doctor} · wait {r.wait}</div>
              <div className="mt-1.5"><StatusBadge value={r.status} /></div>
            </div>
            {r.status !== "Completed" && <Button size="sm" variant="outline" onClick={() => advance(r.id)}>Next</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
