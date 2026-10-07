import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { COLLECTION_NAMES, display, fieldsOf, mergeRecords, type CollectionName, type StoredRecord } from "./records-core";

export type ChangeProposal = {
  action: "create" | "update" | "delete";
  recordKey: string | null;
  recordLabel: string | null;
  fields: { key: string; value: string }[];
  summary: string;
  warnings: string[];
};

const input = z.object({
  collection: z.enum(COLLECTION_NAMES as [CollectionName, ...CollectionName[]]),
  request: z.string().trim().min(3).max(1000),
});

export const proposeChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true; proposal: ChangeProposal } | { ok: false; error: string }> => {
    const { collection, request } = data;
    const { data: stored, error } = await context.supabase
      .from("clinic_records").select("record_key, data, is_deleted").eq("collection", collection);
    if (error) return { ok: false, error: "Couldn't load the current records." };
    const rows = mergeRecords(collection, (stored ?? []) as StoredRecord[]);
    const fields = fieldsOf(collection);
    const fieldKeys = fields.map((f) => f.key);

    const listing = rows.slice(0, 300).map((r) => `${r.__key} | ${fieldKeys.map((k) => `${k}=${display(r[k])}`).join("; ")}`).join("\n");

    const { streamText, Output, jsonSchema } = await import("ai");
    const { createGateway } = await import("./ai-gateway.server");
    const provider = createGateway();

    const schema = jsonSchema<{
      action: "create" | "update" | "delete";
      recordKey: string | null;
      fields: { key: string; value: string }[];
      summary: string;
      warnings: string[];
    }>({
      type: "object",
      additionalProperties: false,
      required: ["action", "recordKey", "fields", "summary", "warnings"],
      properties: {
        action: { type: "string", enum: ["create", "update", "delete"] },
        recordKey: { type: ["string", "null"], description: "Key of the existing record for update/delete; null for create" },
        fields: {
          type: "array",
          items: { type: "object", additionalProperties: false, required: ["key", "value"], properties: { key: { type: "string" }, value: { type: "string" } } },
        },
        summary: { type: "string" },
        warnings: { type: "array", items: { type: "string" } },
      },
    });

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system: `You turn a clinic staff member's plain-language request into ONE change to the "${collection}" records of a homeopathy clinic.
Allowed fields: ${fields.map((f) => `${f.key} (${f.kind}${f.kind === "list" ? ", comma separated" : ""})`).join(", ")}.
Rules:
- For update/delete, recordKey must be copied exactly from the record list. For create, recordKey is null.
- For update, include only fields that change. For create, fill every field you can; leave unknown ones out.
- Dates use YYYY-MM-DD. Numbers are plain digits.
- Never invent medical facts. If the request is ambiguous (e.g. several matching records), pick the best match and explain in warnings.
- summary: one short sentence describing the change for a reviewer.`,
        prompt: `Current records:\n${listing || "(none)"}\n\nRequest: ${request}`,
        output: Output.object({ schema }),
        providerOptions: {
          openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
        },
      });
      const out = await result.output;

      // Validate against the real data before showing it for review.
      const warnings = [...out.warnings];
      const cleanFields = out.fields.filter((f) => {
        if (!fieldKeys.includes(f.key)) { warnings.push(`Ignored unknown field "${f.key}".`); return false; }
        const kind = fields.find((x) => x.key === f.key)!.kind;
        if (kind === "number" && Number.isNaN(Number(f.value))) { warnings.push(`"${f.key}" must be a number.`); return false; }
        return true;
      });
      let recordLabel: string | null = null;
      if (out.action !== "create") {
        const target = rows.find((r) => r.__key === out.recordKey);
        if (!target) return { ok: false, error: "Couldn't find a matching record. Try naming it more precisely." };
        recordLabel = display(target["name"] ?? target["patient"] ?? target["id"] ?? out.recordKey);
      }
      if (out.action !== "delete" && cleanFields.length === 0) return { ok: false, error: "No valid changes were found in that request." };
      return { ok: true, proposal: { action: out.action, recordKey: out.action === "create" ? null : out.recordKey, recordLabel, fields: out.action === "delete" ? [] : cleanFields, summary: out.summary, warnings } };
    } catch (e: unknown) {
      const status = (e as { statusCode?: number })?.statusCode;
      if (status === 429) return { ok: false, error: "AI is busy right now. Please try again in a moment." };
      if (status === 402) return { ok: false, error: "AI credits have run out for this workspace." };
      console.error("proposeChange failed", e);
      return { ok: false, error: "The AI couldn't turn that into a change. Try rephrasing it." };
    }
  });
