import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Hospital = {
  id: string;
  name: string;
  city: string;
  state: string;
  network_type: string;
  specialties: string | null;
  beds: number | null;
  phone: string | null;
};

export type Claim = {
  id: string;
  claim_id: string;
  patient_name: string | null;
  hospital_name: string | null;
  status: string;
  amount: number | null;
  created_at: string;
  updated_at: string;
};

export type EmergencyIntimation = {
  patient_name: string;
  phone: string;
  hospital?: string | null;
  policy_number?: string | null;
  emergency_type?: string | null;
  details?: string | null;
};

export type B2BInquiry = {
  hospital_name: string;
  contact_person: string;
  email?: string | null;
  phone: string;
  service_type?: string | null;
  monthly_pending?: number | null;
  message?: string | null;
};
