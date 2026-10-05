import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, StatusBadge } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { prescriptions as initial } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/pharmacy")({
  head: seo("Dispensing", "Dispense pending prescriptions from the pharmacy."),
  component: Pharmacy,
});

function Pharmacy() {
  const { can } = useAuth();
  const [rx, setRx] = useState(initial);
  const pending = rx.filter((r) => r.status === "Pending");
  return (
    <div className="space-y-6">
      <PageHeader title="Dispensing" subtitle={`${pending.length} prescriptions waiting`} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rx.map((r) => (
          <div key={r.id} className="surface-card p-5">
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">{r.id}</span><StatusBadge value={r.status} /></div>
            <div className="mt-2 font-medium">{r.patient}</div>
            <div className="text-xs text-muted-foreground">{r.doctor} · {r.date}</div>
            <div className="mt-3 rounded-lg bg-muted p-3 text-sm"><b>{r.remedy}</b><div className="text-muted-foreground">{r.dosage} · {r.duration}</div></div>
            {r.status === "Pending" && can("inventory.edit") && (
              <Button className="mt-3 w-full" size="sm" onClick={() => { setRx((x) => x.map((y) => y.id === r.id ? { ...y, status: "Dispensed" } : y)); toast.success(`Dispensed ${r.remedy}`); }}>Mark dispensed</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
