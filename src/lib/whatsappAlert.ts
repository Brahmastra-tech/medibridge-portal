import { supabase } from './supabase';

export interface LeadAlertPayload {
  section: 
    | 'HOSPITAL ONBOARDING' 
    | 'TPA AUDIT' 
    | 'EMERGENCY' 
    | 'DEMO' 
    | 'STAFFING' 
    | 'EMERGENCY LOAN' 
    | 'CUSTOMER';
  hospitalName: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  slotOrDetails?: string;
  region?: 'Delhi NCR' | 'Haryana' | 'Punjab' | 'Other';
  bedCapacity?: string; // 50-300 beds
}

export const sendWhatsAppNotification = async (data: LeadAlertPayload) => {
  const adminPhone = '917669017779';

  const formattedDetails = [
    data.region ? `Region: ${data.region}` : '',
    data.bedCapacity ? `Bed Capacity: ${data.bedCapacity}` : '',
    data.slotOrDetails ? `Details: ${data.slotOrDetails}` : ''
  ].filter(Boolean).join(' | ');

  // 1. Silently save lead directly into Supabase master_leads table
  try {
    await supabase.from('master_leads').insert([
      {
        category: data.section,
        name: data.contactPerson || data.hospitalName || 'Prospective Lead',
        phone: data.phone,
        hospital_or_org: data.hospitalName || 'Not Specified',
        email: data.email || 'N/A',
        details: formattedDetails || 'Direct Inquiry from Portal',
        status: 'New'
      }
    ]);
    console.log(`✅ [Internal Alert] ${data.section} logged for ${data.hospitalName}`);
  } catch (err) {
    console.error('Database logging error:', err);
  }

  // 2. IMPORTANT:
  // Browser popup (window.open) band rakha gaya hai taaki visitor ki screen par WhatsApp na pop-up ho.
  // Agar aap free me apne phone par instant notification chahte hain without WhatsApp popup,
  // toh niche diye gaye Telegram Bot webhook ko use kar sakte hain:
  /*
  const telegramBotToken = 'YOUR_TELEGRAM_BOT_TOKEN';
  const telegramChatId = 'YOUR_CHAT_ID';
  const alertText = `🚨 MEDIBRIDGE ALERT 🚨\nType: ${data.section}\nHospital: ${data.hospitalName}\nPhone: ${data.phone}\nRegion: ${data.region || 'NCR'}`;
  fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(alertText)}`).catch(() => {});
  */
};