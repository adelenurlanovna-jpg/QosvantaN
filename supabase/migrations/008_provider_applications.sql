-- 008_provider_applications.sql
-- Заявки от платёжных провайдеров, которые хотят попасть в каталог Qosvanta.

CREATE TABLE IF NOT EXISTS provider_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  company_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  segment_slug TEXT REFERENCES segments(slug) ON DELETE SET NULL,

  contact_name TEXT,
  contact_email TEXT NOT NULL,
  contact_telegram TEXT,

  description TEXT,

  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewing', 'approved', 'rejected')),

  converted_to_processor_id UUID REFERENCES processors(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_provider_applications_status
  ON provider_applications(status, created_at DESC);

ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;

-- Кто угодно может подать заявку
CREATE POLICY "Anyone can submit a provider application"
  ON provider_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Читать и менять статус — только авторизованные (админка позже)
CREATE POLICY "Authenticated can view applications"
  ON provider_applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update applications"
  ON provider_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
