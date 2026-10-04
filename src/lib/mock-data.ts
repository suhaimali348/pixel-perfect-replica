// Sample data for the frontend-only build. Replace with API calls to your backend.
export type Role = "Super Admin" | "Admin" | "Doctor" | "Receptionist" | "Pharmacist" | "Accountant";

export const PERMISSIONS = [
  "patients.view", "patients.create", "patients.edit", "patients.delete",
  "appointments.view", "appointments.create", "appointments.edit", "appointments.delete",
  "consultations.view", "consultations.create", "consultations.edit",
  "prescriptions.view", "prescriptions.create", "prescriptions.print",
  "inventory.view", "inventory.create", "inventory.edit", "inventory.delete",
  "billing.view", "billing.create", "billing.edit", "billing.delete",
  "reports.view", "reports.export", "admin.manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const all = [...PERMISSIONS];
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "Super Admin": all,
  Admin: all.filter((p) => p !== "billing.delete"),
  Doctor: all.filter((p) => p.startsWith("patients") || p.startsWith("consultations") || p.startsWith("prescriptions") || p.startsWith("appointments.view") || p === "reports.view"),
  Receptionist: ["patients.view", "patients.create", "patients.edit", "appointments.view", "appointments.create", "appointments.edit", "billing.view", "billing.create"],
  Pharmacist: ["patients.view", "prescriptions.view", "prescriptions.print", "inventory.view", "inventory.create", "inventory.edit"],
  Accountant: ["billing.view", "billing.create", "billing.edit", "reports.view", "reports.export"],
};

const first = ["Aarav", "Diya", "Rohan", "Ananya", "Vikram", "Meera", "Kabir", "Isha", "Arjun", "Priya", "Sameer", "Neha", "Rahul", "Kavya", "Aditya", "Sneha"];
const last = ["Sharma", "Patel", "Iyer", "Reddy", "Nair", "Gupta", "Mehta", "Rao", "Kapoor", "Joshi"];
const complaints = ["Chronic migraine", "Eczema", "Allergic rhinitis", "Insomnia", "Acidity", "Joint pain", "Anxiety", "Asthma", "PCOD", "Hair fall"];

export const patients = Array.from({ length: 32 }, (_, i) => ({
  id: `P-${1001 + i}`,
  name: `${first[i % first.length]} ${last[(i * 3) % last.length]}`,
  age: 18 + ((i * 7) % 55),
  gender: i % 2 ? "Female" : "Male",
  phone: `+91 98${(45000000 + i * 13791).toString().slice(0, 8)}`,
  complaint: complaints[i % complaints.length],
  lastVisit: `2026-${String(9 - (i % 3)).padStart(2, "0")}-${String(1 + (i % 28)).padStart(2, "0")}`,
  status: i % 5 === 0 ? "New" : i % 7 === 0 ? "Inactive" : "Active",
  branch: i % 3 ? "Main Clinic" : "Andheri Branch",
}));

export const doctors = ["Dr. Kavita Rao", "Dr. Sanjay Mehta", "Dr. Farah Khan"];

export const appointments = patients.slice(0, 14).map((p, i) => ({
  id: `A-${501 + i}`,
  patient: p.name,
  patientId: p.id,
  doctor: doctors[i % 3],
  time: `${String(9 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
  type: i % 3 === 0 ? "New case" : "Follow-up",
  status: ["Scheduled", "Checked in", "In consultation", "Completed", "Cancelled"][i % 5],
}));

export const queue = appointments.filter((a) => a.status !== "Cancelled" && a.status !== "Completed").map((a, i) => ({ ...a, token: i + 1, wait: `${(i + 1) * 8} min` }));

export const remedies = [
  { name: "Arsenicum album", abbr: "Ars.", kingdom: "Mineral", potencies: ["30C", "200C", "1M"], stock: 42 },
  { name: "Belladonna", abbr: "Bell.", kingdom: "Plant", potencies: ["30C", "200C"], stock: 18 },
  { name: "Bryonia alba", abbr: "Bry.", kingdom: "Plant", potencies: ["30C", "200C"], stock: 25 },
  { name: "Calcarea carbonica", abbr: "Calc.", kingdom: "Mineral", potencies: ["30C", "200C", "1M", "10M"], stock: 9 },
  { name: "Lycopodium clavatum", abbr: "Lyc.", kingdom: "Plant", potencies: ["30C", "200C", "1M"], stock: 31 },
  { name: "Natrum muriaticum", abbr: "Nat-m.", kingdom: "Mineral", potencies: ["30C", "200C", "1M"], stock: 6 },
  { name: "Nux vomica", abbr: "Nux-v.", kingdom: "Plant", potencies: ["30C", "200C"], stock: 55 },
  { name: "Pulsatilla", abbr: "Puls.", kingdom: "Plant", potencies: ["30C", "200C", "1M"], stock: 22 },
  { name: "Rhus toxicodendron", abbr: "Rhus-t.", kingdom: "Plant", potencies: ["30C", "200C"], stock: 14 },
  { name: "Sepia", abbr: "Sep.", kingdom: "Animal", potencies: ["30C", "200C", "1M"], stock: 4 },
  { name: "Sulphur", abbr: "Sulph.", kingdom: "Mineral", potencies: ["30C", "200C", "1M", "10M"], stock: 38 },
  { name: "Phosphorus", abbr: "Phos.", kingdom: "Mineral", potencies: ["30C", "200C", "1M"], stock: 12 },
];

export const rubrics: { chapter: string; rubric: string; remedies: Record<string, number> }[] = [
  { chapter: "Mind", rubric: "Anxiety, health, about", remedies: { "Ars.": 3, "Calc.": 2, "Phos.": 2, "Nux-v.": 1 } },
  { chapter: "Mind", rubric: "Weeping, consolation aggravates", remedies: { "Nat-m.": 3, "Sep.": 2, "Puls.": 1 } },
  { chapter: "Mind", rubric: "Irritability, morning", remedies: { "Nux-v.": 3, "Lyc.": 2, "Sulph.": 1 } },
  { chapter: "Head", rubric: "Pain, sun, from exposure to", remedies: { "Nat-m.": 3, "Bell.": 2, "Lyc.": 1 } },
  { chapter: "Head", rubric: "Pain, throbbing", remedies: { "Bell.": 3, "Nat-m.": 2, "Calc.": 1 } },
  { chapter: "Stomach", rubric: "Desire, sweets", remedies: { "Lyc.": 3, "Sulph.": 2, "Arg-n.": 3, "Calc.": 1 } },
  { chapter: "Stomach", rubric: "Thirstless", remedies: { "Puls.": 3, "Bell.": 1 } },
  { chapter: "Generals", rubric: "Cold, aggravates", remedies: { "Ars.": 3, "Calc.": 3, "Rhus-t.": 2, "Nux-v.": 2 } },
  { chapter: "Generals", rubric: "Motion, aggravates", remedies: { "Bry.": 3, "Nux-v.": 1 } },
  { chapter: "Generals", rubric: "Open air, ameliorates", remedies: { "Puls.": 3, "Lyc.": 2, "Sulph.": 1 } },
  { chapter: "Sleep", rubric: "Sleeplessness, after 3 a.m.", remedies: { "Nux-v.": 3, "Sep.": 1, "Sulph.": 2 } },
  { chapter: "Skin", rubric: "Eruptions, itching, warmth aggravates", remedies: { "Sulph.": 3, "Puls.": 1 } },
];

export const consultations = patients.slice(0, 12).map((p, i) => ({
  id: `C-${2001 + i}`,
  patient: p.name,
  patientId: p.id,
  doctor: doctors[i % 3],
  date: p.lastVisit,
  diagnosis: p.complaint,
  remedy: `${remedies[i % remedies.length].name} ${remedies[i % remedies.length].potencies[i % 2]}`,
  status: i % 4 === 0 ? "Draft" : "Completed",
}));

export const prescriptions = consultations.map((c, i) => ({
  id: `RX-${3001 + i}`,
  patient: c.patient,
  doctor: c.doctor,
  date: c.date,
  remedy: c.remedy,
  dosage: ["4 pills TDS", "2 drops OD", "4 pills BD", "Single dose"][i % 4],
  duration: `${[7, 14, 15, 30][i % 4]} days`,
  status: i % 3 ? "Dispensed" : "Pending",
}));

export const suppliers = [
  { id: "S-01", name: "SBL Pvt. Ltd.", contact: "Ravi Kumar", phone: "+91 11 4050 1234", city: "New Delhi", outstanding: 18400 },
  { id: "S-02", name: "Dr. Willmar Schwabe India", contact: "Anil Sinha", phone: "+91 120 456 7890", city: "Noida", outstanding: 0 },
  { id: "S-03", name: "Bakson's Homeopathy", contact: "Pooja Bhat", phone: "+91 22 2840 1100", city: "Mumbai", outstanding: 6250 },
  { id: "S-04", name: "Reckeweg India", contact: "Suresh Nair", phone: "+91 80 4120 7788", city: "Bengaluru", outstanding: 2100 },
];

export const inventory = remedies.flatMap((r, i) =>
  r.potencies.slice(0, 2).map((pot, j) => ({
    sku: `${r.abbr.replace(/[.-]/g, "").toUpperCase()}-${pot}`,
    name: r.name,
    potency: pot,
    form: ["Dilution 30ml", "Globules 20g", "Mother tincture"][(i + j) % 3],
    batch: `B${24 + i}${j}`,
    expiry: `202${7 + (i % 3)}-0${1 + (j % 9)}-15`,
    qty: Math.max(2, r.stock - j * 7),
    reorder: 10,
    supplier: suppliers[i % suppliers.length].name,
    price: 80 + i * 10,
  })),
);

export const purchases = suppliers.flatMap((s, i) => [0, 1].map((j) => ({
  id: `PO-${701 + i * 2 + j}`,
  supplier: s.name,
  date: `2026-09-${String(5 + i * 5 + j).padStart(2, "0")}`,
  items: 6 + i + j * 3,
  amount: 4200 + i * 2300 + j * 900,
  status: j ? "Received" : "Ordered",
})));

export const invoices = patients.slice(0, 16).map((p, i) => ({
  id: `INV-${4001 + i}`,
  patient: p.name,
  date: `2026-09-${String(1 + i).padStart(2, "0")}`,
  consultation: i % 3 === 0 ? 800 : 500,
  medicines: 150 + (i % 5) * 60,
  discount: i % 4 === 0 ? 100 : 0,
  status: i % 5 === 0 ? "Unpaid" : i % 6 === 0 ? "Partial" : "Paid",
  method: ["UPI", "Cash", "Card"][i % 3],
})).map((inv) => ({ ...inv, total: inv.consultation + inv.medicines - inv.discount }));

export const payments = invoices.filter((i) => i.status !== "Unpaid").map((inv, i) => ({
  id: `PAY-${5001 + i}`,
  invoice: inv.id,
  patient: inv.patient,
  date: inv.date,
  amount: inv.status === "Partial" ? Math.round(inv.total / 2) : inv.total,
  method: inv.method,
}));

export const followups = patients.slice(4, 18).map((p, i) => ({
  id: `F-${601 + i}`,
  patient: p.name,
  due: `2026-10-${String(2 + i).padStart(2, "0")}`,
  doctor: doctors[i % 3],
  reason: `Review: ${p.complaint}`,
  status: i < 3 ? "Overdue" : i < 7 ? "Due" : "Upcoming",
}));

export const users = [
  { name: "Dr. Kavita Rao", email: "kavita@clinic.in", role: "Doctor", branch: "Main Clinic", status: "Active" },
  { name: "Dr. Sanjay Mehta", email: "sanjay@clinic.in", role: "Doctor", branch: "Andheri Branch", status: "Active" },
  { name: "Dr. Farah Khan", email: "farah@clinic.in", role: "Doctor", branch: "Main Clinic", status: "Active" },
  { name: "Ritu Desai", email: "ritu@clinic.in", role: "Receptionist", branch: "Main Clinic", status: "Active" },
  { name: "Manoj Pillai", email: "manoj@clinic.in", role: "Pharmacist", branch: "Main Clinic", status: "Active" },
  { name: "Leena Shah", email: "leena@clinic.in", role: "Accountant", branch: "Main Clinic", status: "Inactive" },
  { name: "Amit Verma", email: "amit@clinic.in", role: "Admin", branch: "All", status: "Active" },
];

export const branches = [
  { id: "BR-1", name: "Main Clinic", address: "12 MG Road, Pune", phone: "+91 20 2612 3344", doctors: 2, patients: 1240 },
  { id: "BR-2", name: "Andheri Branch", address: "4 Link Road, Mumbai", phone: "+91 22 2671 5566", doctors: 1, patients: 560 },
];

export const auditLogs = Array.from({ length: 18 }, (_, i) => ({
  time: `2026-10-04 ${String(18 - Math.floor(i / 2)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
  user: users[i % users.length].name,
  action: ["Created", "Updated", "Deleted", "Viewed", "Printed", "Logged in"][i % 6],
  entity: ["Patient", "Appointment", "Prescription", "Invoice", "Inventory", "Session"][i % 6],
  ref: [`P-${1001 + i}`, `A-${501 + i}`, `RX-${3001 + i}`, `INV-${4001 + i}`, `SKU-${i}`, "—"][i % 6],
  ip: `192.168.1.${20 + i}`,
}));

export const revenueSeries = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m, i) => ({
  month: m,
  consultations: 62000 + i * 5400 + (i % 2) * 3000,
  pharmacy: 28000 + i * 2600,
}));

export const visitSeries = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => ({ day: d, newCases: 4 + (i % 3) * 2, followUps: 14 + i * 2 }));

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
