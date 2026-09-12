import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Zap, 
  ArrowUpRight, 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendWhatsAppNotification } from '../lib/whatsappAlert';

type BadgeType = 'nhcx' | 'abdm' | 'govt' | 'dpdp' | null;

export const B2BServices: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'demo' | 'audit' | null>(null);
  const [activeBadgeInfo, setActiveBadgeInfo] = useState<BadgeType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    hospitalName: '',
    contactPerson: '',
    email: '',
    phone: '',
    region: 'Delhi NCR' as 'Delhi NCR' | 'Haryana' | 'Punjab' | 'Other',
    bedCapacity: '50-100 Beds',
    message: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeModal === 'demo') {
        const slotText = `${formData.region} | ${formData.bedCapacity} | ${formData.message.trim() || 'TPA Desk & Onboarding Evaluation'}`;

        // 1. Backward compatibility with demo_requests table
        await supabase.from('demo_requests').insert([
          {
            hospital_name: formData.hospitalName.trim(),
            full_name: formData.contactPerson.trim(),
            email: formData.email.trim(),
            mobile: formData.phone.trim(),
            preferred_slot: slotText,
            status: 'Pending'
          }
        ]);

        // 2. Centralized lead pipeline with onboarding specifics
        await sendWhatsAppNotification({
          section: 'HOSPITAL ONBOARDING',
          hospitalName: formData.hospitalName.trim(),
          contactPerson: formData.contactPerson.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          region: formData.region,
          bedCapacity: formData.bedCapacity,
          slotOrDetails: formData.message.trim() || 'Turnkey TPA Desk Onboarding'
        });

        alert('Hospital Onboarding & Demo request submitted successfully! Regional desk will connect.');
      } else {
        const fileDetail = selectedFileName ? ` | File: ${selectedFileName}` : '';
        const auditNotes = `Region: ${formData.region} | Email: ${formData.email.trim()} | ${formData.message.trim()}${fileDetail}`;

        // 1. Save into claim_audits table
        await supabase.from('claim_audits').insert([
          {
            hospital_name: formData.hospitalName.trim(),
            contact_person: formData.contactPerson.trim(),
            phone: formData.phone.trim(),
            city: formData.region,
            pending_amount: 50000,
            notes: auditNotes,
            status: 'New'
          }
        ]);

        // 2. Trigger notification pipeline
        await sendWhatsAppNotification({
          section: 'TPA AUDIT',
          hospitalName: formData.hospitalName.trim(),
          contactPerson: formData.contactPerson.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          region: formData.region,
          bedCapacity: formData.bedCapacity,
          slotOrDetails: `${formData.message.trim() || 'Claim Audit MIS'}${fileDetail}`
        });

        alert('Audit details submitted successfully! Desk will initiate reconciliation audit.');
      }

      setFormData({
        hospitalName: '',
        contactPerson: '',
        email: '',
        phone: '',
        region: 'Delhi NCR',
        bedCapacity: '50-100 Beds',
        message: ''
      });
      setSelectedFileName(null);
      setActiveModal(null);
    } catch (err: any) {
      console.error('Submission Error:', err);
      alert('Submission failed: ' + (err.message || 'Database error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const badgeDetails: Record<string, { title: string; subtitle: string; points: string[]; note: string }> = {
    nhcx: {
      title: 'National Health Claims Exchange (NHCX)',
      subtitle: 'IRDAI & NHA Unified Gateway Protocol',
      points: [
        'Single API switch connected to 24+ General/Health insurers and all authorized TPAs.',
        'Real-time automated Pre-Auth response without manual multi-portal logins.',
        'Zero file dispatch lag for cashless claim settlements.'
      ],
      note: 'MediBridge desk bridges your hospital HIS directly with the NHCX switch.'
    },
    abdm: {
      title: 'Ayushman Bharat Digital Mission (ABDM)',
      subtitle: 'M1, M2 & M3 Compliance Level',
      points: [
        'Seamless ABHA ID verification & QR-based express patient registrations.',
        'Health Information Provider (HIP) & Health Information User (HIU) record flow.',
        'Govt health benefit verification in under 60 seconds.'
      ],
      note: 'Assists hospitals in claiming Govt digitalization incentive fund (DHIS).'
    },
    govt: {
      title: 'CGHS, RGHS, ECHS & State Schemes',
      subtitle: 'Institutional Public Payor Desk',
      points: [
        'Dedicated tracking desk for Central CGHS, Haryana/Punjab state health schemes, and ECHS.',
        'Specialized packaging and query clearance for strict government guidelines.',
        'Disallowance tracking to unlock aged treasury receivables.'
      ],
      note: 'High-volume government claim processing with dedicated reconciliation.'
    },
    dpdp: {
      title: 'Digital Personal Data Protection Act 2023',
      subtitle: 'Enterprise-Grade Health Data Privacy',
      points: [
        'Zero-Data Retention: Diagnostic files and reports are processed in secure ephemeral sessions.',
        'End-to-end 256-bit AES encryption in transit and at rest.',
        'Hospital audit logs with multi-factor authentication compliance.'
      ],
      note: 'Ensures hospital management and patients are 100% legally shielded under Indian privacy laws.'
    }
  };

  return (
    <section id="b2b" className="py-24 bg-[#071328]/80 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clickable Enterprise Compliance & Payor Header */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setActiveBadgeInfo('nhcx')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 hover:scale-105 transition-all shadow-sm cursor-pointer"
          >
            <CheckCircle2 size={13} /> NHCX Enabled <Info size={12} className="opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => setActiveBadgeInfo('abdm')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold hover:bg-teal-500/20 hover:scale-105 transition-all shadow-sm cursor-pointer"
          >
            <Layers size={13} /> ABDM Compliant <Info size={12} className="opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => setActiveBadgeInfo('govt')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 hover:scale-105 transition-all shadow-sm cursor-pointer"
          >
            <ShieldCheck size={13} /> CGHS / State Schemes Ready <Info size={12} className="opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => setActiveBadgeInfo('dpdp')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-750 hover:scale-105 transition-all shadow-sm cursor-pointer"
          >
            🔒 DPDP Act 2023 Secure <Info size={12} className="opacity-70" />
          </button>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
            Institutional Hospital Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Accelerate Cash Flow & Cut Claim Turnaround
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Onboarding 50–300 bed mid-sized hospitals across Delhi NCR, Haryana, and Punjab. Two-way sync with your current HIS/ERP with zero software migration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Dedicated TPA Helpdesk Integration */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dedicated TPA Helpdesk Integration</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Complete on-premise & remote cashless operations. Instant query responses, 30-min pre-auth, and real-time NHCX gateway handling.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('demo')}
              className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Onboard Hospital / Request Demo <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Card 2: Stuck Claims Audit */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pending Claim Audit & Disallowance Recovery</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Drop your aging claim MIS. We audit deductions, dispute repudiations, and initiate recovery with zero upfront cost.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('audit')}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
            >
              Submit Pending Claims for Free Audit <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Badge Information Popup */}
      {activeBadgeInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setActiveBadgeInfo(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">
              {badgeDetails[activeBadgeInfo].subtitle}
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1 mb-4">
              {badgeDetails[activeBadgeInfo].title}
            </h3>

            <div className="space-y-3 mb-6">
              {badgeDetails[activeBadgeInfo].points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-6">
              <p className="text-xs text-slate-400 italic">
                💡 {badgeDetails[activeBadgeInfo].note}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActiveBadgeInfo(null);
                  setActiveModal('demo');
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                Schedule Architecture Demo
              </button>
              <button
                onClick={() => setActiveBadgeInfo(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-xs sm:text-sm transition-all border border-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Action Modal (Hospital Onboarding Demo / Audit) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white">
              {activeModal === 'demo' ? 'Hospital Onboarding & TPA Demo' : 'Submit Pending Claims for Free Audit'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              {activeModal === 'demo'
                ? 'Onboarding 50–300 bed hospitals across Delhi NCR, Haryana, and Punjab.'
                : 'Upload aging ledger or claims summary. Pay only upon actual cash recovery.'}
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="Hospital / Nursing Home Name *"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />

              <input
                type="text"
                required
                placeholder="Contact Person / Medical Director *"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                />

                <input
                  type="tel"
                  required
                  placeholder="Direct Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>

              {/* Geographic Region & Bed Capacity Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Other">Other North Region</option>
                </select>

                <select
                  value={formData.bedCapacity}
                  onChange={(e) => setFormData({ ...formData, bedCapacity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="50-100 Beds">50–100 Beds</option>
                  <option value="100-200 Beds">100–200 Beds</option>
                  <option value="200-300 Beds">200–300 Beds</option>
                  <option value="300+ Beds">300+ Beds (Tertiary)</option>
                </select>
              </div>

              {activeModal === 'audit' && (
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/60 relative">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    {selectedFileName ? (
                      <>
                        <FileSpreadsheet className="text-emerald-400" size={24} />
                        <span className="text-xs text-emerald-300 font-medium truncate max-w-xs">{selectedFileName}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="text-amber-400" size={24} />
                        <span className="text-xs font-semibold text-slate-300">Upload Claims Ledger / MIS (Excel/CSV)</span>
                        <span className="text-[11px] text-slate-500">Secure AES-256 encrypted parsing</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder={activeModal === 'demo' ? 'Current HIS Software (e.g. Akhil, KareXpert, Custom)' : 'Approximate Stuck Claims Value (e.g. ₹25 Lakhs)'}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default B2BServices;