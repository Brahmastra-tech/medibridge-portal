/*
# Create MediBridge Health Core Tables

## Overview
Creates the database tables that power the MediBridge Health portal:
network hospitals, insurance claims, emergency intimation records, and
B2B service inquiry submissions from hospitals/nursing homes.

## New Tables

1. `hospitals` — Directory of network hospitals
   - `id` (uuid, primary key)
   - `name` (text, not null)
   - `city` (text, not null)
   - `state` (text, not null)
   - `network_type` (text: Cashless / Non-Cashless)
   - `specialties` (text, comma-separated)
   - `beds` (int)
   - `phone` (text)
   - `created_at` (timestamptz)

2. `claims` — Insurance claims tracked by claim ID
   - `id` (uuid, primary key)
   - `claim_id` (text, unique, not null) — the public-facing claim reference
   - `patient_name` (text)
   - `hospital_name` (text)
   - `status` (text: Pending / Approved / Rejected / Under Review)
   - `amount` (numeric)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

3. `emergency_intimations` — Emergency intimation form submissions
   - `id` (uuid, primary key)
   - `patient_name` (text, not null)
   - `phone` (text, not null)
   - `hospital` (text)
   - `policy_number` (text)
   - `emergency_type` (text)
   - `details` (text)
   - `created_at` (timestamptz)

4. `b2b_inquiries` — B2B demo/audit requests from hospitals
   - `id` (uuid, primary key)
   - `hospital_name` (text, not null)
   - `contact_person` (text, not null)
   - `email` (text)
   - `phone` (text, not null)
   - `service_type` (text: TPA Helpdesk / AR Recovery)
   - `monthly_pending` (numeric) — monthly pending TPA claims in INR
   - `message` (text)
   - `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- All tables use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a single-tenant public portal (no sign-in screen) — the data
  is intentionally public/shared for read, and form submissions are public writes.
*/

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  network_type text NOT NULL DEFAULT 'Cashless',
  specialties text,
  beds int DEFAULT 0,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hospitals" ON hospitals;
CREATE POLICY "anon_select_hospitals" ON hospitals FOR SELECT
  TO anon, authenticated USING (true);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id text UNIQUE NOT NULL,
  patient_name text,
  hospital_name text,
  status text NOT NULL DEFAULT 'Pending',
  amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_claims" ON claims;
CREATE POLICY "anon_select_claims" ON claims FOR SELECT
  TO anon, authenticated USING (true);

-- Emergency intimation table
CREATE TABLE IF NOT EXISTS emergency_intimations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  phone text NOT NULL,
  hospital text,
  policy_number text,
  emergency_type text,
  details text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_intimations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_emergency" ON emergency_intimations;
CREATE POLICY "anon_insert_emergency" ON emergency_intimations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- B2B inquiries table
CREATE TABLE IF NOT EXISTS b2b_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name text NOT NULL,
  contact_person text NOT NULL,
  email text,
  phone text NOT NULL,
  service_type text,
  monthly_pending numeric DEFAULT 0,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE b2b_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_b2b" ON b2b_inquiries;
CREATE POLICY "anon_insert_b2b" ON b2b_inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed sample hospitals
INSERT INTO hospitals (name, city, state, network_type, specialties, beds, phone)
VALUES
  ('Apollo Hospital', 'Chennai', 'Tamil Nadu', 'Cashless', 'Cardiology, Neurology, Orthopedics', 500, '+91 44 2829 3333'),
  ('Fortis Hospital', 'Bengaluru', 'Karnataka', 'Cashless', 'Oncology, Cardiology, Nephrology', 400, '+91 80 6621 4444'),
  ('Max Super Speciality', 'New Delhi', 'Delhi', 'Cashless', 'Cardiac Sciences, Neuro Sciences', 350, '+91 11 2651 5050'),
  ('Lilavati Hospital', 'Mumbai', 'Maharashtra', 'Cashless', 'Cardiology, Orthopedics, Pediatrics', 300, '+91 22 2675 1000'),
  ('AIIMS', 'New Delhi', 'Delhi', 'Cashless', 'All Specialties', 1000, '+91 11 2658 8500'),
  ('Manipal Hospital', 'Bengaluru', 'Karnataka', 'Cashless', 'Cardiology, Oncology, Transplant', 600, '+91 80 2502 4444'),
  ('Kokilaben Hospital', 'Mumbai', 'Maharashtra', 'Cashless', 'Neurosciences, Cardiac, Cancer', 750, '+91 22 4269 6969'),
  ('Artemis Hospital', 'Gurugram', 'Haryana', 'Cashless', 'Cardiology, Neurology, Orthopedics', 400, '+91 124 4511 555'),
  ('Medanta Hospital', 'Gurugram', 'Haryana', 'Cashless', 'Cardiac Sciences, Neurosciences', 1250, '+91 124 4141 414'),
  ('Narayana Health', 'Bengaluru', 'Karnataka', 'Cashless', 'Cardiology, Oncology, Neurology', 500, '+91 80 7122 2222'),
  ('Ruby Hall Clinic', 'Pune', 'Maharashtra', 'Cashless', 'Oncology, IVF, Cardiology', 350, '+91 20 6645 5000'),
  ('Sterling Hospital', 'Ahmedabad', 'Gujarat', 'Cashless', 'Cardiology, Neurology, Trauma', 250, '+91 79 2686 1000'),
  ('Jaslok Hospital', 'Mumbai', 'Maharashtra', 'Cashless', 'Gynecology, Cardiology, Nephrology', 300, '+91 22 6657 0000'),
  ('CMC Vellore', 'Vellore', 'Tamil Nadu', 'Cashless', 'All Specialties', 800, '+91 416 228 1000'),
  ('KIMS Hospital', 'Hyderabad', 'Telangana', 'Cashless', 'Cardiac, Neuro, Ortho', 450, '+91 40 2335 0000')
ON CONFLICT DO NOTHING;

-- Seed sample claims
INSERT INTO claims (claim_id, patient_name, hospital_name, status, amount)
VALUES
  ('MB-2024-001234', 'Rajesh Kumar', 'Apollo Hospital', 'Approved', 125000),
  ('MB-2024-001235', 'Priya Sharma', 'Fortis Hospital', 'Under Review', 85000),
  ('MB-2024-001236', 'Amit Patel', 'Max Super Speciality', 'Pending', 200000),
  ('MB-2024-001237', 'Sneha Reddy', 'Manipal Hospital', 'Approved', 45000),
  ('MB-2024-001238', 'Mohammed Ali', 'Medanta Hospital', 'Rejected', 75000),
  ('MB-2024-001239', 'Lakshmi Iyer', 'Kokilaben Hospital', 'Under Review', 150000),
  ('MB-2024-001240', 'Vikram Singh', 'Artemis Hospital', 'Approved', 95000),
  ('MB-2024-001241', 'Anjali Gupta', 'Lilavati Hospital', 'Pending', 60000)
ON CONFLICT DO NOTHING;
