import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, CalendarCheck, IndianRupee, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, StatusBadge } from "@/components/pms/DataPage";
import { appointments, followups, inventory, inr, patients, revenueSeries, visitSeries } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/dashboard")({
  head: seo("Dashboard", "Today's clinic overview: patients, appointments, revenue and alerts."),
  component: Dashboard,
});

function Stat({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string; note: string }) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span>
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-success">{note}</div>
    </div>
  );
}

function Dashboard() {
  const lowStock = inventory.filter((i) => i.qty <= i.reorder);
  return (
    <div className="space-y-6">
      <PageHeader title="Good evening, Dr. Rao" subtitle="Sunday, 4 October 2026 · Main Clinic" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users} label="Total patients" value={String(1800)} note="+42 this month" />
        <Stat icon={CalendarCheck} label="Today's appointments" value={String(appointments.length)} note="6 completed" />
        <Stat icon={IndianRupee} label="Today's revenue" value={inr(18450)} note="+12% vs last Sunday" />
        <Stat icon={AlertTriangle} label="Low stock items" value={String(lowStock.length)} note="Reorder suggested" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="surface-card p-5 xl:col-span-2">
          <h3 className="font-display font-semibold">Revenue (last 6 months)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Area dataKey="consultations" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
                <Area dataKey="pharmacy" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <h3 className="font-display font-semibold">Visits this week</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={visitSeries}>
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="followUps" stackId="a" fill="var(--chart-1)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="newCases" stackId="a" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="surface-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between"><h3 className="font-display font-semibold">Today's appointments</h3>
            <Link to="/appointments" className="flex items-center gap-1 text-sm text-primary">View all <ArrowUpRight className="size-3" /></Link></div>
          <div className="mt-3 divide-y">
            {appointments.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-4 py-3 text-sm">
                <span className="w-14 font-mono text-muted-foreground">{a.time}</span>
                <span className="flex-1 font-medium">{a.patient}</span>
                <span className="hidden text-muted-foreground md:block">{a.doctor}</span>
                <StatusBadge value={a.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="surface-card p-5">
          <h3 className="font-display font-semibold">Alerts</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {followups.filter((f) => f.status === "Overdue").map((f) => (
              <li key={f.id} className="rounded-lg bg-destructive/8 p-3"><b>{f.patient}</b> — follow-up overdue since {f.due}</li>
            ))}
            {lowStock.slice(0, 3).map((i) => (
              <li key={i.sku} className="rounded-lg bg-warning/15 p-3"><b>{i.name} {i.potency}</b> — only {i.qty} left</li>
            ))}
            <li className="rounded-lg bg-primary/8 p-3">{patients.filter((p) => p.status === "New").length} new patient registrations this week</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
