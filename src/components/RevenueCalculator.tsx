import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Clock, IndianRupee, Zap, X, CheckCircle2, Building2, User, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const pendingAmountOptions = [
  'Below ₹10 Lakhs',
  '₹10L - ₹25L',
  '₹25L - ₹50L',
  '₹50L+',
];

export default function RevenueCalculator() {
  const [pending, setPending] = useState(50);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);
  const [auditForm, setAuditForm] = useState({
    hospital_name: '',
    contact_person: '',
    phone: '',
    city_state: '',
    pending_amount: 'Below ₹10 Lakhs',
  });

  const recoveryRate = 0.65;
  const daysSaved = 45;

  const recoverable = useMemo(() => pending * recoveryRate, [pending]);
  const recoverableRupees = useMemo(() => recoverable * 100000, [recoverable]);

  const formatRupees = (val: number) => {
    if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(2)} L`;
    return val.toLocaleString('en-IN');
  };

  const pendingRupees = pending * 100000;

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('free_claims_audits').insert(auditForm);
    setSubmitting(false);
    if (error) {
      alert('Submission failed. Please try again or call us at +91 76690 17779.');
      return;
    }
    setAuditSuccess(true);
    setAuditForm({
      hospital_name: '',
      contact_person: '',
      phone: '',
      city_state: '',
      pending_amount: 'Below ₹10 Lakhs',
    });
  };

  return (
    <section id="calculator" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-4">
            <Calculator className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-cyan-300 text-xs font-medium tracking-wide">Hospital Revenue Calculator</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Estimate Your <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">Recoverable Revenue</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            See how much stuck TPA revenue MediBridge can recover and how many days
            you save on every claim cycle.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] backdrop-blur-xl border border-white/10 p-8 lg:p-10">
          <div className="mb-8">
            <label className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm font-medium">Monthly Pending TPA Claims</span>
              <span className="text-cyan-300 font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {formatRupees(pendingRupees)}
              </span>
            </label>
            <input
              type="range"
              min={10}
              max={1000}
              step={5}
              value={pending}
              onChange={(e) => setPending(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-cyan-400"
              style={{
                background: `linear-gradient(to right, #0ea5e9 ${((pending - 10) / 990) * 100}%, rgba(255,255,255,0.08) ${((pending - 10) / 990) * 100}%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>₹10 Lakhs</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-400/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-cyan-300" />
                </div>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Est. Recoverable Revenue</span>
              </div>
              <div
                className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {formatRupees(recoverableRupees)}
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Based on 65% historical recovery rate on aged TPA claims
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-400/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-teal-300" />
                </div>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Avg. Days Saved</span>
              </div>
              <div
                className="text-3xl font-extrabold text-teal-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {daysSaved} days
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Reduced from ~75-day to ~30-day average resolution cycle
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-4">
            <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <p className="text-slate-300 text-sm">
              <span className="text-white font-semibold">Zero upfront fees.</span> You pay
              only on successful recovery — pure success-based commission model.
            </p>
          </div>

          <button
            onClick={() => { setAuditSuccess(false); setShowAuditModal(true); }}
            className="mt-6 group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 text-[#061224] font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            Start Your Free Claims Audit
          </button>
        </div>
      </div>

      {/* Free Claims Audit Modal */}
      {showAuditModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAuditModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#061224] border border-cyan-400/20 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {auditSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-teal-500/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Thank You!
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Our claims audit team will contact you within 2 business hours.
                </p>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-medium text-sm hover:bg-cyan-500/20 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Free Claims Audit
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Zero upfront fees. Pay only on recovery.</p>
                  </div>
                  <button onClick={() => setShowAuditModal(false)} className="text-slate-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAuditSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
                      <Building2 className="w-3.5 h-3.5" /> Hospital / Nursing Home Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={auditForm.hospital_name}
                      onChange={(e) => setAuditForm({ ...auditForm, hospital_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-colors"
                      placeholder="Hospital name"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
                      <User className="w-3.5 h-3.5" /> Contact Person Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={auditForm.contact_person}
                      onChange={(e) => setAuditForm({ ...auditForm, contact_person: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
                      <Phone className="w-3.5 h-3.5" /> Mobile / WhatsApp Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={auditForm.phone}
                      onChange={(e) => setAuditForm({ ...auditForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
                      <MapPin className="w-3.5 h-3.5" /> City / State *
                    </label>
                    <input
                      required
                      type="text"
                      value={auditForm.city_state}
                      onChange={(e) => setAuditForm({ ...auditForm, city_state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-colors"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-2 block">
                      Estimated Pending TPA Claim Amount *
                    </label>
                    <select
                      required
                      value={auditForm.pending_amount}
                      onChange={(e) => setAuditForm({ ...auditForm, pending_amount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-colors"
                    >
                      {pendingAmountOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0B192C]">{opt}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 text-[#061224] font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Free Audit Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
