import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { patients } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/case-taking")({
  head: seo("Case taking", "Structured homeopathic case taking for new and chronic cases."),
  component: CaseTaking,
});

const sections: Record<string, string[]> = {
  complaints: ["Chief complaint", "Location", "Sensation", "Modalities (better / worse)", "Concomitants", "Onset & duration"],
  history: ["Past history", "Family history", "Vaccination history", "Treatment history"],
  generals: ["Appetite", "Thirst", "Cravings & aversions", "Thermal state", "Perspiration", "Sleep & dreams", "Stool & urine"],
  mind: ["Temperament", "Fears", "Emotional state", "Stress factors", "Reaction to consolation"],
  exam: ["Weight / BP / Pulse", "Physical examination", "Investigations"],
};

function CaseTaking() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader title="Case taking" subtitle="Record the full homeopathic picture before repertorization."
        actions={<>
          <Button variant="outline" onClick={() => toast.success("Draft saved (sample)")}>Save draft</Button>
          <Button onClick={() => navigate({ to: "/repertory" })}>Continue to repertory</Button>
        </>} />
      <div className="surface-card grid gap-4 p-5 md:grid-cols-3">
        <div className="space-y-1.5"><Label>Patient</Label>
          <select className="h-9 w-full rounded-md border bg-background px-3 text-sm">{patients.map((p) => <option key={p.id}>{p.id} — {p.name}</option>)}</select></div>
        <div className="space-y-1.5"><Label>Case type</Label>
          <select className="h-9 w-full rounded-md border bg-background px-3 text-sm"><option>Chronic</option><option>Acute</option></select></div>
        <div className="space-y-1.5"><Label>Date</Label><Input type="date" defaultValue="2026-10-05" /></div>
      </div>
      <Tabs defaultValue="complaints" className="surface-card p-5">
        <TabsList className="flex-wrap">
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="generals">Physical generals</TabsTrigger>
          <TabsTrigger value="mind">Mind</TabsTrigger>
          <TabsTrigger value="exam">Examination</TabsTrigger>
        </TabsList>
        {Object.entries(sections).map(([k, fields]) => (
          <TabsContent key={k} value={k} className="grid gap-4 pt-4 md:grid-cols-2">
            {fields.map((f) => <div key={f} className="space-y-1.5"><Label>{f}</Label><Textarea rows={3} /></div>)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
