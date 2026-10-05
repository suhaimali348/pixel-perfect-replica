import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { patients, remedies } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/consultations/new")({
  head: seo("New consultation", "Record a consultation and prescribe remedies."),
  component: NewConsultation,
});

type Line = { remedy: string; potency: string; dose: string; days: string };
const blank = (): Line => ({ remedy: remedies[0].name, potency: "30C", dose: "4 pills TDS", days: "15" });
const sel = "h-9 w-full rounded-md border bg-background px-3 text-sm";

function NewConsultation() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([blank()]);
  const set = (i: number, k: keyof Line, v: string) => setLines((l) => l.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader title="New consultation" subtitle="Notes, prescription and next follow-up in one place." />
      <div className="surface-card grid gap-4 p-5 md:grid-cols-2">
        <div className="space-y-1.5"><Label>Patient</Label><select className={sel}>{patients.map((p) => <option key={p.id}>{p.id} — {p.name}</option>)}</select></div>
        <div className="space-y-1.5"><Label>Follow-up date</Label><Input type="date" defaultValue="2026-10-20" /></div>
        <div className="space-y-1.5"><Label>Presenting symptoms</Label><Textarea rows={3} /></div>
        <div className="space-y-1.5"><Label>Diagnosis / miasm</Label><Textarea rows={3} /></div>
        <div className="space-y-1.5 md:col-span-2"><Label>Doctor's notes</Label><Textarea rows={3} /></div>
      </div>
      <div className="surface-card p-5">
        <div className="mb-3 flex items-center justify-between"><h3 className="font-display font-semibold">Prescription</h3>
          <Button size="sm" variant="outline" onClick={() => setLines((l) => [...l, blank()])}><Plus className="size-4" /> Add remedy</Button></div>
        <div className="space-y-3">
          {lines.map((l, i) => {
            const r = remedies.find((x) => x.name === l.remedy) ?? remedies[0];
            return (
              <div key={i} className="grid items-end gap-3 md:grid-cols-[2fr_1fr_1.5fr_1fr_auto]">
                <div className="space-y-1.5"><Label>Remedy</Label><select className={sel} value={l.remedy} onChange={(e) => set(i, "remedy", e.target.value)}>{remedies.map((x) => <option key={x.name}>{x.name}</option>)}</select></div>
                <div className="space-y-1.5"><Label>Potency</Label><select className={sel} value={l.potency} onChange={(e) => set(i, "potency", e.target.value)}>{r.potencies.map((p) => <option key={p}>{p}</option>)}</select></div>
                <div className="space-y-1.5"><Label>Dosage</Label><Input value={l.dose} onChange={(e) => set(i, "dose", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Days</Label><Input value={l.days} onChange={(e) => set(i, "days", e.target.value)} /></div>
                <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => setLines((x) => x.filter((_, j) => j !== i))}><Trash2 className="size-4" /></Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.print()}><Printer className="size-4" /> Print</Button>
        <Button onClick={() => { toast.success("Consultation saved (sample)"); navigate({ to: "/consultations" }); }}>Save consultation</Button>
      </div>
    </div>
  );
}
