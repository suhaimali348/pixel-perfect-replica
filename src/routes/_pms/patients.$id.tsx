import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Phone, Stethoscope } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { consultations, followups, inr, invoices, patients, prescriptions } from "@/lib/mock-data";

export const Route = createFileRoute("/_pms/patients/$id")({
  loader: ({ params }) => {
    const patient = patients.find((p) => p.id === params.id);
    if (!patient) throw notFound();
    return { patient };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.patient.name} — Similia PMS` }, { name: "description", content: "Patient record" }, { property: "og:title", content: loaderData.patient.name }, { property: "og:description", content: "Patient record" }]
      : [{ title: "Patient not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <p className="text-muted-foreground">Patient not found. <Link to="/patients" className="text-primary">Back to patients</Link></p>,
  component: PatientDetail,
});

function PatientDetail() {
  const { patient: p } = Route.useLoaderData();
  const cons = consultations.filter((c) => c.patient === p.name);
  const rx = prescriptions.filter((r) => r.patient === p.name);
  const inv = invoices.filter((i) => i.patient === p.name);
  const fu = followups.filter((f) => f.patient === p.name);
  const list = (rows: { k: string; a: string; b: string; s?: string }[]) =>
    rows.length ? (
      <div className="divide-y">{rows.map((r) => (
        <div key={r.k} className="flex items-center gap-4 py-3 text-sm"><span className="w-28 text-muted-foreground">{r.k}</span><span className="flex-1">{r.a}</span><span className="text-muted-foreground">{r.b}</span>{r.s && <StatusBadge value={r.s} />}</div>
      ))}</div>
    ) : <p className="py-6 text-sm text-muted-foreground">No records yet.</p>;
  return (
    <div className="space-y-6">
      <PageHeader title={p.name} subtitle={`${p.id} · ${p.age} yrs · ${p.gender} · ${p.branch}`}
        actions={<Button asChild><Link to="/consultations"><Stethoscope className="size-4" /> Start consultation</Link></Button>} />
      <div className="grid gap-4 md:grid-cols-4">
        {[["Chief complaint", p.complaint], ["Last visit", p.lastVisit], ["Phone", p.phone], ["Status", p.status]].map(([k, v]) => (
          <div key={k} className="surface-card p-4"><div className="text-xs text-muted-foreground">{k}</div><div className="mt-1 flex items-center gap-2 font-medium">{k === "Phone" && <Phone className="size-3" />}{k === "Status" ? <StatusBadge value={v} /> : v}</div></div>
        ))}
      </div>
      <Tabs defaultValue="consultations" className="surface-card p-5">
        <TabsList>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="consultations">{list(cons.map((c) => ({ k: c.date, a: `${c.diagnosis} → ${c.remedy}`, b: c.doctor, s: c.status })))}</TabsContent>
        <TabsContent value="prescriptions">{list(rx.map((r) => ({ k: r.date, a: `${r.remedy} · ${r.dosage}`, b: r.duration, s: r.status })))}</TabsContent>
        <TabsContent value="billing">{list(inv.map((i) => ({ k: i.date, a: i.id, b: inr(i.total), s: i.status })))}</TabsContent>
        <TabsContent value="followups">{list(fu.map((f) => ({ k: f.due, a: f.reason, b: f.doctor, s: f.status })))}</TabsContent>
        <TabsContent value="documents"><p className="py-6 text-sm text-muted-foreground">Lab reports and scans will appear here once file storage is connected.</p></TabsContent>
      </Tabs>
    </div>
  );
}
