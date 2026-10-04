import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Similia PMS" },
      { name: "description", content: "Sign in to your homeopathy clinic workspace." },
      { property: "og:title", content: "Sign in — Similia PMS" },
      { property: "og:description", content: "Sign in to your homeopathy clinic workspace." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [forgot, setForgot] = useState(false);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 font-display text-lg font-bold"><Leaf className="size-6" /> Similia PMS</div>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">Run your homeopathy clinic<br />from one calm workspace.</h1>
          <p className="mt-4 max-w-md opacity-85">Case taking, repertorization, prescriptions, dispensing and billing — connected end to end.</p>
        </div>
        <div className="text-sm opacity-70">Trusted by doctors, receptionists and pharmacists.</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form className="w-full max-w-sm space-y-5" onSubmit={(e) => {
          e.preventDefault();
          if (forgot) { toast.success("If the email exists, a reset link has been sent."); setForgot(false); return; }
          navigate({ to: "/dashboard" });
        }}>
          <div>
            <h2 className="font-display text-2xl font-bold">{forgot ? "Reset password" : "Welcome back"}</h2>
            <p className="text-sm text-muted-foreground">{forgot ? "We'll email you a reset link." : "Sign in to continue to your clinic."}</p>
          </div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="kavita@clinic.in" required /></div>
          {!forgot && <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" defaultValue="demo1234" required /></div>}
          {!forgot && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><Checkbox defaultChecked /> Remember me</label>
              <button type="button" className="text-primary hover:underline" onClick={() => setForgot(true)}>Forgot password?</button>
            </div>
          )}
          <Button type="submit" className="w-full">{forgot ? "Send reset link" : "Sign in"}</Button>
          {forgot && <button type="button" className="w-full text-sm text-muted-foreground hover:underline" onClick={() => setForgot(false)}>Back to sign in</button>}
          <p className="text-center text-xs text-muted-foreground">Demo mode — any credentials work.</p>
        </form>
      </div>
    </div>
  );
}
