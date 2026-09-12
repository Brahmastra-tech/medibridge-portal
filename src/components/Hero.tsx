import React, { useState } from 'react';
import { Shield, Clock, TrendingUp, ArrowRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendWhatsAppNotification } from '../lib/whatsappAlert';

export const Hero: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    contactPerson: '',
    email: '',
    phone: '',
    slot: ''
  });

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Direct insert to Supabase
      const { error } = await supabase.from('demo_requests').insert([
        {
          hospital_name: formData.hospitalName.trim(),
          full_name: formData.contactPerson.trim(),
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          preferred_slot: formData.slot.trim() || 'Immediate Call',
          status: 'Pending'
        }
      ]);

      if (error) throw error;

      // 2. Structured WhatsApp Alert Intimation
      sendWhatsAppNotification({
        section: 'DEMO',
        hospitalName: formData.hospitalName.trim(),
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        slotOrDetails: formData.slot.trim() || 'Immediate Call'
      });

      alert('Demo request submitted successfully! Record saved.');
      
      // 3. Form Clean
      setFormData({ hospitalName: '', contactPerson: '', email: '', phone: '', slot: '' });
      setIsDemoModalOpen(false);
    } catch (err: any) {
      console.error('Demo submission error:', err);
      alert('Submission failed: ' + (err.message || 'Please check your connection'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield size={14} /> India's Premier Hospital TPA Partner
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Transform Your Hospital's <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Cashless Claims</span> Recovery
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed">
            Eliminate pre-auth delays, reduce denial rates below 2%, and accelerate insurance settlement with MediBridge's 24/7 dedicated TPA desk.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Request TPA Helpdesk Demo <ArrowRight size={18} />
            </button>
            <a
              href="#emergency"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700 flex items-center justify-center transition-all"
            >
              Emergency Intimation
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <Clock className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">30 Mins</div>
              <div className="text-xs text-slate-400 mt-1">Average Pre-Auth Turnaround</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">98.5%</div>
              <div className="text-xs text-slate-400 mt-1">Initial Approval Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <Shield className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Zero Cost</div>
              <div className="text-xs text-slate-400 mt-1">Setup & Desk Integration</div>
            </div>
          </div>
        </div>
      </div>

      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white">Request TPA Helpdesk Demo</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">See how 30-minute pre-auth approvals work for your hospital.</p>

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Hospital"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="tpa@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Slot / Remarks</label>
                <input
                  type="text"
                  placeholder="Preferred time"
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Demo Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;