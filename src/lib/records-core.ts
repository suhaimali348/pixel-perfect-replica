// Shared (browser + server) logic for clinic records.
// Starter rows come from mock-data; saved changes live in the clinic_records table
// and override starter rows with the same key.
import * as m from "./mock-data";

export const COLLECTIONS = {
  patients: m.patients, appointments: m.appointments, followups: m.followups,
  consultations: m.consultations, prescriptions: m.prescriptions, inventory: m.inventory,
  suppliers: m.suppliers, purchases: m.purchases, invoices: m.invoices, payments: m.payments,
  users: m.users, branches: m.branches, remedies: m.remedies,
} as const;
export type CollectionName = keyof typeof COLLECTIONS;
export const COLLECTION_NAMES = Object.keys(COLLECTIONS) as CollectionName[];

export const COLLECTION_LABELS: Record<CollectionName, string> = {
  patients: "Patients", appointments: "Appointments", followups: "Follow-ups",
  consultations: "Consultations", prescriptions: "Prescriptions", inventory: "Inventory",
  suppliers: "Suppliers", purchases: "Purchases", invoices: "Invoices", payments: "Payments",
  users: "Users", branches: "Branches", remedies: "Remedies",
};

export type Row = Record<string, unknown>;
export type StoredRecord = { record_key: string; data: Row; is_deleted: boolean };
export type MergedRow = Row & { __key: string };

export const seedKey = (c: CollectionName, i: number) => `seed:${c}:${i}`;

export function seedRow(c: CollectionName, key: string): Row | undefined {
  const i = Number(key.split(":")[2]);
  return key.startsWith(`seed:${c}:`) ? (COLLECTIONS[c][i] as Row | undefined) : undefined;
}

export function mergeRecords(c: CollectionName, stored: StoredRecord[]): MergedRow[] {
  const byKey = new Map(stored.map((s) => [s.record_key, s]));
  const out: MergedRow[] = [];
  (COLLECTIONS[c] as readonly Row[]).forEach((row, i) => {
    const k = seedKey(c, i);
    const s = byKey.get(k);
    if (s?.is_deleted) return;
    out.push({ ...(s ? s.data : row), __key: k });
  });
  stored.filter((s) => !s.record_key.startsWith("seed:") && !s.is_deleted).forEach((s) => out.push({ ...s.data, __key: s.record_key }));
  return out;
}

/** Field names and their kind (number vs text) for a collection, based on its starter rows. */
export function fieldsOf(c: CollectionName): { key: string; kind: "number" | "text" | "list" }[] {
  const sample = COLLECTIONS[c][0] as Row;
  return Object.entries(sample).map(([key, v]) => ({
    key, kind: typeof v === "number" ? "number" : Array.isArray(v) ? "list" : "text",
  }));
}

/** Converts form/AI string values into the right stored types for the collection. */
export function coerce(c: CollectionName, values: Record<string, string>): Row {
  const out: Row = {};
  for (const f of fieldsOf(c)) {
    if (!(f.key in values)) continue;
    const v = values[f.key] ?? "";
    out[f.key] = f.kind === "number" ? Number(v) || 0 : f.kind === "list" ? v.split(",").map((s) => s.trim()).filter(Boolean) : v;
  }
  return out;
}

export const display = (v: unknown) => (Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v));
