import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/pms/DataPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_pms/patients/new")({
  head: seo("Register patient", "Add a new patient to the clinic."),
  component: NewPatient,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter full name").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{8,16}$/, "Enter a valid phone"),
  email: z.string().trim().email("Invalid email").or(z.literal("")),
  dob: z.string().min(1, "Required"),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().max(300).optional(),
  complaint: z.string().trim().min(2, "Required").max(200),
  allergies: z.string().max(300).optional(),
});
type F = z.infer<typeof schema>;

function NewPatient() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema), defaultValues: { gender: "Female" } });
  const field = (k: keyof F, label: string, el?: ReactElement) => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      {el ?? <Input id={k} {...register(k)} />}
      {errors[k] && <p className="text-xs text-destructive">{errors[k]?.message}</p>}
    </div>
  );
  return (
    <div className="max-w-3xl">
      <PageHeader title="Register patient" subtitle="Patient ID is generated automatically." />
      <form className="surface-card grid gap-4 p-6 md:grid-cols-2" onSubmit={handleSubmit((d) => { toast.success(`${d.name} registered (sample)`); navigate({ to: "/patients" }); })}>
        {field("name", "Full name")}
        {field("phone", "Phone")}
        {field("email", "Email")}
        {field("dob", "Date of birth", <Input id="dob" type="date" {...register("dob")} />)}
        {field("gender", "Gender", (
          <select id="gender" {...register("gender")} className="h-9 w-full rounded-md border bg-background px-3 text-sm">
            <option>Female</option><option>Male</option><option>Other</option>
          </select>
        ))}
        {field("complaint", "Chief complaint")}
        <div className="md:col-span-2">{field("address", "Address", <Textarea id="address" {...register("address")} />)}</div>
        <div className="md:col-span-2">{field("allergies", "Allergies / notes", <Textarea id="allergies" {...register("allergies")} />)}</div>
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/patients" })}>Cancel</Button>
          <Button type="submit">Save patient</Button>
        </div>
      </form>
    </div>
  );
}
