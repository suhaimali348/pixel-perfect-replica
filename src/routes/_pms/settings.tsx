import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/settings")({
  head: seo("Settings", "Clinic profile, billing defaults and notification preferences."),
  component: SettingsPage,
});

function SettingsPage() {
  const f = (label: string, value: string) => <div className="space-y-1.5"><Label>{label}</Label><Input defaultValue={value} /></div>;
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" actions={<Button onClick={() => toast.success("Settings saved (sample)")}>Save changes</Button>} />
      <section className="surface-card grid gap-4 p-5 md:grid-cols-2">
        <h3 className="font-display font-semibold md:col-span-2">Clinic profile</h3>
        {f("Clinic name", "Similia Homeopathy Clinic")}{f("Registration no.", "MH-HOM-20431")}
        {f("Phone", "+91 20 2612 3344")}{f("Email", "hello@clinic.in")}
      </section>
      <section className="surface-card grid gap-4 p-5 md:grid-cols-2">
        <h3 className="font-display font-semibold md:col-span-2">Billing defaults</h3>
        {f("New case fee (₹)", "800")}{f("Follow-up fee (₹)", "500")}{f("GST on medicines (%)", "12")}{f("Invoice prefix", "INV-")}
      </section>
      <section className="surface-card space-y-4 p-5">
        <h3 className="font-display font-semibold">Notifications</h3>
        {["SMS appointment reminders", "WhatsApp follow-up reminders", "Low stock email alerts", "Daily revenue summary"].map((n, i) => (
          <label key={n} className="flex items-center justify-between text-sm">{n}<Switch defaultChecked={i !== 3} /></label>
        ))}
      </section>
    </div>
  );
}
