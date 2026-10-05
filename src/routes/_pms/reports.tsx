import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { inr, patients, remedies, revenueSeries, visitSeries } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/reports")({
  head: seo("Reports", "Revenue, visits, complaints and remedy usage reports."),
  component: Reports,
});

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Reports() {
  const { can } = useAuth();
  const byComplaint = Object.entries(patients.reduce<Record<string, number>>((a, p) => ({ ...a, [p.complaint]: (a[p.complaint] ?? 0) + 1 }), {})).map(([name, value]) => ({ name, value })).slice(0, 5);
  const card = "surface-card p-5";
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="April – September 2026"
        actions={can("reports.export") && <Button variant="outline" onClick={() => toast.success("Report exported (sample)")}><Download className="size-4" /> Export</Button>} />
      <div className="grid gap-4 xl:grid-cols-2">
        <div className={card}><h3 className="font-display font-semibold">Monthly revenue</h3><div className="mt-4 h-64"><ResponsiveContainer>
          <LineChart data={revenueSeries}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}k`} /><Tooltip formatter={(v: number) => inr(v)} />
            <Line dataKey="consultations" stroke="var(--chart-1)" strokeWidth={2} /><Line dataKey="pharmacy" stroke="var(--chart-3)" strokeWidth={2} /></LineChart>
        </ResponsiveContainer></div></div>
        <div className={card}><h3 className="font-display font-semibold">Top complaints</h3><div className="mt-4 h-64"><ResponsiveContainer>
          <PieChart><Pie data={byComplaint} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} label={(e) => e.name}>{byComplaint.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer></div></div>
        <div className={card}><h3 className="font-display font-semibold">Weekly visits</h3><div className="mt-4 h-64"><ResponsiveContainer>
          <BarChart data={visitSeries}><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="followUps" fill="var(--chart-1)" /><Bar dataKey="newCases" fill="var(--chart-3)" /></BarChart>
        </ResponsiveContainer></div></div>
        <div className={card}><h3 className="font-display font-semibold">Remedy stock levels</h3><div className="mt-4 h-64"><ResponsiveContainer>
          <BarChart data={remedies} layout="vertical"><XAxis type="number" fontSize={12} /><YAxis type="category" dataKey="abbr" width={60} fontSize={12} /><Tooltip /><Bar dataKey="stock" fill="var(--chart-2)" /></BarChart>
        </ResponsiveContainer></div></div>
      </div>
    </div>
  );
}
