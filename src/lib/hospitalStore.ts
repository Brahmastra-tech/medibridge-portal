// src/lib/hospitalStore.ts

export interface RohiniRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contactPerson: string;
  contactNo: string;
  email: string;
}

export interface HospitalUser {
  userId: string;
  rohiniId: string;
  hospitalName: string;
  name: string;
  role: 'Hospital Admin' | 'Finance / Billing' | 'Operations' | 'HR' | 'Viewer';
  email: string;
  mobile: string;
  createdAt: string;
}

export interface ReconUploadRow {
  id: string;
  claimId: string;
  patientName: string;
  payer: string;
  billedAmount: number;
  settledAmount: number;
  varianceAmount: number;
  utr: string;
  status: 'Matched' | 'Variance' | 'Manual Review';
  deductionReason?: string;
}

export interface AdminLead {
  id: string;
  rohiniId: string;
  hospitalName: string;
  service: string;
  contactPerson: string;
  contactNo: string;
  createdAt: string;
  status: 'New' | 'In Review' | 'Processed';
}

// Global In-Memory Master State
export const INITIAL_ROHINI_REGISTRY: Record<string, RohiniRecord> = {
  'ROHINI-892101': {
    id: 'ROHINI-892101',
    name: 'Apollo Multispeciality Hospital',
    address: 'Sarita Vihar, Delhi Mathura Road',
    city: 'New Delhi',
    state: 'Delhi',
    contactPerson: 'Dr. Rajiv Malhotra',
    contactNo: '+91 98110 44210',
    email: 'billing@apollo.org'
  },
  'ROHINI-441208': {
    id: 'ROHINI-441208',
    name: 'Max Super Speciality Hospital',
    address: 'B-Block Sushant Lok 1',
    city: 'Gurugram',
    state: 'Haryana',
    contactPerson: 'Suresh Singhania',
    contactNo: '+91 98710 99882',
    email: 'tpa@maxhealthcare.com'
  },
  'ROHINI-773190': {
    id: 'ROHINI-773190',
    name: 'Fortis Memorial Research Institute',
    address: 'Sector 44, Opp City Center',
    city: 'Gurugram',
    state: 'Haryana',
    contactPerson: 'Pooja Verma',
    contactNo: '+91 99100 23412',
    email: 'finance@fmri.org'
  },
  'ROHINI-102934': {
    id: 'ROHINI-102934',
    name: 'Medanta - The Medicity',
    address: 'CH Bakhtawar Singh Rd, Sector 38',
    city: 'Gurugram',
    state: 'Haryana',
    contactPerson: 'Anand Kulkarni',
    contactNo: '+91 98230 11987',
    email: 'claims@medanta.org'
  }
};