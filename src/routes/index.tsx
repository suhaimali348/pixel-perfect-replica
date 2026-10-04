import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Similia PMS — Homeopathy Practice Management" },
      { name: "description", content: "Patients, case taking, repertory, pharmacy and billing for homeopathy clinics." },
      { property: "og:title", content: "Similia PMS — Homeopathy Practice Management" },
      { property: "og:description", content: "Patients, case taking, repertory, pharmacy and billing for homeopathy clinics." },
    ],
  }),
});
