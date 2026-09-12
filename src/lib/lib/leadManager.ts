import { supabase } from './supabase';
import { sendWhatsAppNotification } from './whatsappAlert';

export interface LeadPayload {
  category: 'Corporate' | 'Customer' | 'Staffing' | 'Emergency Loan' | 'Audit';
  name: string;
  phone: string;
  hospitalOrOrg?: string;
  email?: string;
  details?: string;
}

export async function submitGlobalLead(lead: LeadPayload) {
  try {
    // 1. Supabase database mein record save karein
    const { error } = await supabase.from('master_leads').insert([
      {
        category: lead.category,
        name: lead.name.trim(),
        phone: lead.phone.trim(),
        hospital_or_org: lead.hospitalOrOrg?.trim() || 'N/A',
        email: lead.email?.trim() || 'N/A',
        details: lead.details?.trim() || 'No additional note',
        status: 'New'
      }
    ]);

    if (error) {
      console.error('Supabase Lead Save Error:', error.message);
    }

    // 2. WhatsApp notification dispatch karein
    sendWhatsAppNotification({
      section: lead.category.toUpperCase(),
      hospitalName: lead.hospitalOrOrg || lead.name,
      contactPerson: lead.name,
      phone: lead.phone,
      email: lead.email || 'N/A',
      slotOrDetails: lead.details || `Inquiry for ${lead.category}`
    });

    return { success: true };
  } catch (err: any) {
    console.error('Lead pipeline failure:', err);
    return { success: false, error: err.message };
  }
}