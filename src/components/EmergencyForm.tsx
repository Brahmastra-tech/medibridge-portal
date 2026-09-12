import React, { useState } from 'react';
import { AlertCircle, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendWhatsAppNotification } from '../lib/whatsappAlert';

export const EmergencyForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    hospital: '',
    policyNumber: '',
    emergencyType: 'Accident / Trauma',
    description: ''
  });

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Direct Supabase Database Save
      const { error } = await supabase.from('emergency_intimations').insert([
        {
          patient_name: formData.patientName.trim(),
          phone: formData.phone.trim(),
          hospital: formData.hospital.trim() || 'Not Specified',
          policy_number: formData.policyNumber.trim() || 'Pending Card',
          emergency_type: formData.emergencyType,
          description: formData.description.trim() || 'Immediate Emergency Care',
          status: 'Intimated'
        }
      ]);

      if (error) throw error;

      // 2. Structured WhatsApp Alert
      sendWhatsAppNotification({
        section: 'EMERGENCY',
        hospitalName: formData.hospital.trim() || 'Emergency Desk',
        contactPerson: formData.patientName.trim(),
        phone: formData.phone.trim(),
        email: 'N/A',
        slotOrDetails: `Policy: ${formData.policyNumber || 'N/A'} | Type: ${formData.emergencyType} | Notes: ${formData.description || 'None'}`
      });

      alert('Emergency Intimation Submitted! Desk alerted.');

      // 3. Form Clean
      setFormData({
        patientName: '',
        phone: '',
        hospital: '',
        policyNumber: '',
        emergencyType: 'Accident / Trauma',
        description: ''
      });

      // 4. Return to Home View
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Emergency Submit Error:', err);
      alert(`Submission Error: ${err.message || 'Database connection error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectChat = () => {
    sendWhatsAppNotification({
      section: 'EMERGENCY',
      hospitalName: formData.hospital || 'Direct Inquiry',
      contactPerson: formData.patientName || 'Patient Attendant',
      phone: formData.phone || 'Direct Chat',
      email: 'N/A',
      slotOrDetails: 'Direct WhatsApp Helpline Clicked'
    });
  };

  return (
    <section id="emergency" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold tracking-wide uppercase">
              <AlertCircle size={14} /> Urgent Care & TPA Desk
            </span>
            <h2 className="text-3xl font-bold text-white mt-3">Emergency Admission Intimation</h2>
            <p className="text-xs text-slate-400 mt-2">
              Notify us instantly during a medical emergency. Our team coordinates pre-auth while you focus on patient care.
            </p>
          </div>

          <form onSubmit={handleEmergencySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Patient Name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hospital</label>
                <input
                  type="text"
                  placeholder="Hospital Name"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Policy Number</label>
                <input
                  type="text"
                  placeholder="Policy Number"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Emergency Type</label>
                <select
                  value={formData.emergencyType}
                  onChange={(e) => setFormData({ ...formData, emergencyType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 text-sm"
                >
                  <option value="Accident / Trauma">Accident / Trauma</option>
                  <option value="Emergency Pre-Auth">Emergency Pre-Auth</option>
                  <option value="ICU Admission">ICU Admission</option>
                  <option value="Query / Denial Escalation">Query / Denial Escalation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Additional Details</label>
                <textarea
                  rows={3}
                  placeholder="Additional Details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <Send size={16} /> {isSubmitting ? 'Saving Intimation...' : 'Send Emergency Intimation'}
              </button>

              <button
                type="button"
                onClick={handleDirectChat}
                className="px-6 py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all"
              >
                <MessageSquare size={16} /> Chat on WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmergencyForm;