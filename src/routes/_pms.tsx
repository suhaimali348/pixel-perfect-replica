import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, CalendarDays, ListOrdered, Stethoscope, ClipboardList, BookOpen, Pill,
  FileText, Package, Truck, ShoppingCart, Receipt, Wallet, Bell, BarChart3, UserCog, ShieldCheck,
  Building2, Settings, History, LogOut, Leaf, FlaskConical, CalendarClock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_PERMISSIONS, type Permission, type Role } from "@/lib/mock-data";

export const Route = createFileRoute("/_pms")({ component: Layout });

type Item = { to: string; label: string; icon: typeof Users; perm?: Permission };
const groups: { title: string; items: Item[] }[] = [
  { title: "Clinic", items: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users, perm: "patients.view" },
    { to: "/appointments", label: "Appointments", icon: CalendarDays, perm: "appointments.view" },
    { to: "/queue", label: "Patient queue", icon: ListOrdered, perm: "appointments.view" },
    { to: "/followups", label: "Follow-ups", icon: CalendarClock, perm: "patients.view" },
  ]},
  { title: "Clinical", items: [
    { to: "/case-taking", label: "Case taking", icon: ClipboardList, perm: "consultations.create" },
    { to: "/consultations", label: "Consultations", icon: Stethoscope, perm: "consultations.view" },
    { to: "/repertory", label: "Repertory", icon: BookOpen, perm: "consultations.view" },
    { to: "/prescriptions", label: "Prescriptions", icon: FileText, perm: "prescriptions.view" },
  ]},
  { title: "Pharmacy", items: [
    { to: "/pharmacy", label: "Dispensing", icon: Pill, perm: "prescriptions.view" },
    { to: "/medicines", label: "Remedy master", icon: FlaskConical, perm: "inventory.view" },
    { to: "/inventory", label: "Inventory", icon: Package, perm: "inventory.view" },
    { to: "/suppliers", label: "Suppliers", icon: Truck, perm: "inventory.view" },
    { to: "/purchases", label: "Purchases", icon: ShoppingCart, perm: "inventory.view" },
  ]},
  { title: "Finance", items: [
    { to: "/billing", label: "Billing", icon: Receipt, perm: "billing.view" },
    { to: "/payments", label: "Payments", icon: Wallet, perm: "billing.view" },
    { to: "/reports", label: "Reports", icon: BarChart3, perm: "reports.view" },
  ]},
  { title: "Administration", items: [
    { to: "/users", label: "Users", icon: UserCog, perm: "admin.manage" },
    { to: "/roles", label: "Roles & permissions", icon: ShieldCheck, perm: "admin.manage" },
    { to: "/branches", label: "Branches", icon: Building2, perm: "admin.manage" },
    { to: "/audit-logs", label: "Audit logs", icon: History, perm: "admin.manage" },
    { to: "/settings", label: "Settings", icon: Settings, perm: "admin.manage" },
  ]},
];

function Layout() {
  const { can, role, setRole, name } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground"><Leaf className="size-5" /></div>
          <div>
            <div className="font-display text-base font-bold text-sidebar-accent-foreground">Similia PMS</div>
            <div className="text-[11px] opacity-70">Homeopathy practice suite</div>
          </div>
        </div>
        <nav className="flex-1 space-y-5 px-3 pb-6">
          {groups.map((g) => {
            const items = g.items.filter((i) => !i.perm || can(i.perm));
            if (!items.length) return null;
            return (
              <div key={g.title}>
                <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest opacity-50">{g.title}</div>
                {items.map((i) => (
                  <Link key={i.to} to={i.to}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary" }}>
                    <i.icon className="size-4" /> {i.label}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/90 px-6 backdrop-blur">
          <div className="text-sm text-muted-foreground">Main Clinic · Pune</div>
          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              View as
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}
                className="rounded-md border bg-background px-2 py-1.5 text-sm text-foreground">
                {Object.keys(ROLE_PERMISSIONS).map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <Link to="/followups" className="relative rounded-md p-2 hover:bg-accent" aria-label="Notifications">
              <Bell className="size-5" /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            </Link>
            <div className="grid size-9 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">KR</div>
            <div className="hidden text-sm leading-tight md:block"><div className="font-medium">{name}</div><div className="text-xs text-muted-foreground">{role}</div></div>
            <button onClick={() => navigate({ to: "/login", replace: true })} className="rounded-md p-2 hover:bg-accent" aria-label="Log out"><LogOut className="size-4" /></button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
