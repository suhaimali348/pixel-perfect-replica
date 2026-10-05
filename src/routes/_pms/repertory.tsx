import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PageHeader } from "@/components/pms/DataPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rubrics } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/repertory")({
  head: seo("Repertory", "Search rubrics and repertorize symptoms to rank remedies."),
  component: Repertory,
});

function Repertory() {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const found = rubrics.map((r, i) => ({ ...r, i })).filter((r) => `${r.chapter} ${r.rubric}`.toLowerCase().includes(q.toLowerCase()));
  const result = useMemo(() => {
    const score: Record<string, { total: number; count: number }> = {};
    picked.forEach((i) => Object.entries(rubrics[i].remedies).forEach(([rem, g]) => {
      score[rem] ??= { total: 0, count: 0 };
      score[rem].total += g; score[rem].count += 1;
    }));
    return Object.entries(score).sort((a, b) => b[1].count - a[1].count || b[1].total - a[1].total);
  }, [picked]);
  const max = result[0]?.[1].total ?? 1;
  return (
    <div className="space-y-6">
      <PageHeader title="Repertory" subtitle="Pick rubrics to rank remedies by how many symptoms they cover and how strongly." />
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="surface-card p-5">
          <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search rubrics, e.g. 'thirst' or 'Mind'" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="mt-3 max-h-[480px] divide-y overflow-y-auto">
            {found.map((r) => (
              <button key={r.i} onClick={() => setPicked((p) => p.includes(r.i) ? p : [...p, r.i])}
                className="flex w-full items-start gap-3 py-2.5 text-left text-sm hover:bg-accent/50">
                <span className="w-20 shrink-0 text-xs font-semibold uppercase text-primary">{r.chapter}</span>
                <span className="flex-1">{r.rubric}</span>
                <span className="text-xs text-muted-foreground">{Object.keys(r.remedies).length} rem.</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="surface-card p-5">
            <div className="flex items-center justify-between"><h3 className="font-display font-semibold">Selected rubrics ({picked.length})</h3>
              {picked.length > 0 && <Button size="sm" variant="ghost" onClick={() => setPicked([])}>Clear</Button>}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {picked.length === 0 && <p className="text-sm text-muted-foreground">Click rubrics on the left to add them.</p>}
              {picked.map((i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {rubrics[i].chapter}: {rubrics[i].rubric}
                  <button onClick={() => setPicked((p) => p.filter((x) => x !== i))} aria-label="Remove"><X className="size-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="surface-card p-5">
            <h3 className="font-display font-semibold">Repertorization result</h3>
            <div className="mt-3 space-y-2.5">
              {result.map(([rem, s], idx) => (
                <div key={rem} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-muted-foreground">{idx + 1}</span>
                  <span className="w-20 font-semibold">{rem}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gradient-primary" style={{ width: `${(s.total / max) * 100}%` }} /></div>
                  <span className="w-24 text-right text-xs text-muted-foreground">{s.count}/{picked.length} · {s.total} pts</span>
                </div>
              ))}
              {!result.length && <p className="text-sm text-muted-foreground">No rubrics selected yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
