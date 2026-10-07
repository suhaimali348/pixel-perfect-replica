CREATE TABLE public.clinic_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection text NOT NULL,
  record_key text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (collection, record_key)
);
GRANT SELECT, INSERT, UPDATE ON public.clinic_records TO authenticated;
GRANT ALL ON public.clinic_records TO service_role;
ALTER TABLE public.clinic_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read records" ON public.clinic_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can add records" ON public.clinic_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff can change records" ON public.clinic_records FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.record_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection text NOT NULL,
  record_key text NOT NULL,
  action text NOT NULL,
  actor_id uuid,
  actor_email text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX record_history_lookup ON public.record_history (collection, record_key, created_at DESC);
GRANT SELECT ON public.record_history TO authenticated;
GRANT ALL ON public.record_history TO service_role;
ALTER TABLE public.record_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read history" ON public.record_history FOR SELECT TO authenticated USING (true);

-- History is written only by this trigger, so entries can't be forged from the app.
CREATE OR REPLACE FUNCTION public.log_record_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  act text;
  prev jsonb := NULL;
BEGIN
  NEW.updated_at := now();
  IF TG_OP = 'INSERT' THEN
    act := CASE WHEN NEW.is_deleted THEN 'deleted' WHEN NEW.record_key LIKE 'seed:%' THEN 'edited' ELSE 'created' END;
    -- seed rows edited for the first time: the original lives in the app's starter data
    IF NEW.data ? '__original' THEN
      prev := NEW.data -> '__original';
      NEW.data := NEW.data - '__original';
    END IF;
  ELSE
    prev := OLD.data;
    act := CASE WHEN NEW.is_deleted AND NOT OLD.is_deleted THEN 'deleted'
                WHEN OLD.is_deleted AND NOT NEW.is_deleted THEN 'restored'
                ELSE 'edited' END;
  END IF;
  INSERT INTO public.record_history (collection, record_key, action, actor_id, actor_email, before_data, after_data)
  VALUES (NEW.collection, NEW.record_key, act, auth.uid(), auth.jwt() ->> 'email', prev,
          CASE WHEN act = 'deleted' THEN NULL ELSE NEW.data END);
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.log_record_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER clinic_records_history
BEFORE INSERT OR UPDATE ON public.clinic_records
FOR EACH ROW EXECUTE FUNCTION public.log_record_change();