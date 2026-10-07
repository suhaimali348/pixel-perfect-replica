import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mergeRecords, seedRow, type CollectionName, type Row, type StoredRecord } from "./records-core";

const storedKey = (c: CollectionName) => ["clinic_records", c] as const;

export function useCollection(c: CollectionName) {
  const qc = useQueryClient();
  const stored = useQuery({
    queryKey: storedKey(c),
    queryFn: async () => {
      const { data, error } = await supabase.from("clinic_records").select("record_key, data, is_deleted").eq("collection", c);
      if (error) throw error;
      return data as StoredRecord[];
    },
  });

  const save = useMutation({
    mutationFn: async ({ key, data, deleted = false }: { key: string; data: Row; deleted?: boolean }) => {
      const existing = stored.data?.find((s) => s.record_key === key);
      if (existing) {
        const { error } = await supabase.from("clinic_records").update({ data: data as never, is_deleted: deleted }).eq("collection", c).eq("record_key", key);
        if (error) throw error;
      } else {
        // First change to a starter row: send the original so history shows the "before" values.
        const original = seedRow(c, key);
        const payload = original ? { ...data, __original: original } : data;
        const { error } = await supabase.from("clinic_records").insert({ collection: c, record_key: key, data: payload as never, is_deleted: deleted });
        if (error) throw error;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: storedKey(c) });
      qc.invalidateQueries({ queryKey: ["record_history"] });
    },
  });

  return {
    rows: mergeRecords(c, stored.data ?? []),
    isLoading: stored.isLoading,
    error: stored.error,
    create: (data: Row) => save.mutateAsync({ key: `new:${crypto.randomUUID()}`, data }),
    update: (key: string, data: Row) => save.mutateAsync({ key, data }),
    remove: (key: string, data: Row) => save.mutateAsync({ key, data, deleted: true }),
    saving: save.isPending,
  };
}

export type HistoryEntry = {
  id: string; collection: string; record_key: string; action: string;
  actor_email: string | null; before_data: Row | null; after_data: Row | null; created_at: string;
};

export function useHistory(filter?: { collection: CollectionName; key: string }) {
  return useQuery({
    queryKey: ["record_history", filter?.collection ?? "all", filter?.key ?? "all"],
    queryFn: async () => {
      let q = supabase.from("record_history").select("*").order("created_at", { ascending: false }).limit(200);
      if (filter) q = q.eq("collection", filter.collection).eq("record_key", filter.key);
      const { data, error } = await q;
      if (error) throw error;
      return data as HistoryEntry[];
    },
  });
}
