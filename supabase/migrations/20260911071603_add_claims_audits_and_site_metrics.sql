/*
# Add Free Claims Audits and Site Metrics Tables

## Overview
Creates two new tables:
1. `free_claims_audits` — Stores submissions from the "Start Your Free Claims Audit" modal form.
2. `site_metrics` — Stores editable homepage stats that the admin can update without touching code.

## New Tables

### 1. free_claims_audits
- `id` (uuid, primary key)
- `hospital_name` (text, not null) — Hospital or Nursing Home name
- `contact_person` (text, not null) — Contact person name
- `phone` (text, not null) — Mobile / WhatsApp number
- `city_state` (text, not null) — City / State
- `pending_amount` (text, not null) — Estimated pending TPA claim amount range
- `status` (text, default 'New') — Lead status: New / Contacted / Converted
- `created_at` (timestamptz)

### 2. site_metrics
- `id` (uuid, primary key)
- `key` (text, unique, not null) — Metric key (e.g. 'network_hospitals', 'claims_processed', 'approval_rate')
- `label` (text, not null) — Display label
- `value` (text, not null) — Display value
- `icon` (text) — Icon name for the homepage stat card
- `updated_at` (timestamptz)

## Security
- RLS enabled on all tables.
- free_claims_audits: public INSERT (anon can submit), admin-only read/update via service role.
  - SELECT/UPDATE policies use `TO anon, authenticated` with `USING (true)` so the
    admin panel (using the anon key) can read and update. This is a single-tenant
    no-auth app; the admin password is enforced client-side in the admin route.
- site_metrics: public SELECT (anon can read for homepage display), admin-only UPDATE.
  - Same pattern: `TO anon, authenticated` for both read and write.

## Seed Data
- site_metrics seeded with 3 default metrics: Network Hospitals (500+), Total Claims Processed (12,000+), Approval Rate (98.5%).
*/

-- Free claims audits table
CREATE TABLE IF NOT EXISTS free_claims_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  city_state text NOT NULL,
  pending_amount text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE free_claims_audits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_free_claims_audits" ON free_claims_audits;
CREATE POLICY "anon_insert_free_claims_audits" ON free_claims_audits FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_free_claims_audits" ON free_claims_audits;
CREATE POLICY "anon_select_free_claims_audits" ON free_claims_audits FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_free_claims_audits" ON free_claims_audits;
CREATE POLICY "anon_update_free_claims_audits" ON free_claims_audits FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Site metrics table
CREATE TABLE IF NOT EXISTS site_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  icon text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_metrics" ON site_metrics;
CREATE POLICY "anon_select_site_metrics" ON site_metrics FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_site_metrics" ON site_metrics;
CREATE POLICY "anon_update_site_metrics" ON site_metrics FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_site_metrics" ON site_metrics;
CREATE POLICY "anon_insert_site_metrics" ON site_metrics FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed default site metrics
INSERT INTO site_metrics (key, label, value, icon)
VALUES
  ('network_hospitals', 'Network Hospitals', '500+', 'Building2'),
  ('claims_processed', 'Total Claims Processed', '12,000+', 'FileText'),
  ('approval_rate', 'Approval Rate', '98.5%', 'ShieldCheck')
ON CONFLICT (key) DO NOTHING;
