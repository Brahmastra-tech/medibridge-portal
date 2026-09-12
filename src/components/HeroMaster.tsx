import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Users, 
  BadgePercent, 
  ArrowRight, 
  HeartPulse, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  X, 
  FileText, 
  ShieldCheck, 
  Stethoscope, 
  Activity, 
  PackageCheck,
  Percent
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type ActiveCategory = 'corporate' | 'customer' | 'staffing' | 'funds';
type ModalType = 'audit' | 'staffing' | 'loan' | 'management' | 'call' | 'package' | null;

export default function HeroMaster() {
  const [activeTab, setActiveTab] = useState<ActiveCategory>('customer');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    org: '',
    details: '',
    subType: 'Comprehensive Health Insurance'
  });

  const openForm = (modal: ModalType, defaultType: string = '') => {
    setActiveModal(modal);
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      org: '',
      details: '',
      subType: defaultType || 'Comprehensive Health Insurance'
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent, categoryName: string) => {
    e.preventDefault();
    if (!formData.phone.trim()) return;

    setSubmitting(true);
    try {
      await supabase.from('master_leads').insert([
        {
          category: categoryName,
          name: formData.name.trim() || 'Customer Visitor',
          phone: formData.phone.trim(),
          hospital_or_org: formData.org.trim() || 'Individual Applicant',
          email: formData.email.trim() || 'N/A',
          details: `Plan/Package: ${formData.subType} | Notes: ${formData.details.trim() || 'Direct Inquiry'}`,
          status: 'New'
        }
      ]);

      setSubmitted(true);
      setTimeout(() => {
        setActiveModal(null);
        setSubmitted(false);
      }, 2200);
    } catch (err: any) {
      console.error('Lead submission failed:', err);
      alert('Request noted. Our desk will contact you.');
      setActiveModal(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="home" className="relative min-h-[92vh] pt-24 pb-16 flex items-center justify-center overflow-hidden">
      
      {/* Background Visual Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-20 filter contrast-125"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040d1a]/85 via-[#040d1a]/95 to-[#040d1a] z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top 4-Segment Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/95 border border-slate-750 backdrop-blur-xl shadow-2xl flex-wrap justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('corporate')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'corporate'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 size={16} /> Corporates & Hospitals
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck size={16} /> Individuals & Families
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('staffing')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'staffing'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users size={16} /> Hospital Staff & Facility
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('funds')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'funds'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BadgePercent size={16} /> Emergency Medical Credit
            </button>
          </div>
        </div>

        {/* Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Dynamic Column */}
          <div className="lg:col-span-8 text-left">
            
            {/* CORPORATE TAB */}
            {activeTab === 'corporate' && (
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={14} /> Delhi NCR • Haryana • Punjab Hospital Onboarding
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  Accelerate Hospital Cash Flow. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                    Zero TPA Claim Disallowances.
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  Turnkey on-premise & remote TPA desks. 30-minute cashless pre-authorization, automated NHCX/ABDM integration, and disallowance recovery with zero upfront cost.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="#b2b"
                    className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25"
                  >
                    Onboard Hospital / TPA Demo <ArrowRight size={16} />
                  </a>
                  <a
                    href="#reconciliation"
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all"
                  >
                    Instant Auto-Recon Engine
                  </a>
                </div>
              </div>
            )}

            {/* CUSTOMER TAB (HEALTH PLANS + TERM PLANS + PREVENTIVE PACKAGES) */}
            {activeTab === 'customer' && (
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <HeartPulse size={14} /> Comprehensive Health & Life Ecosystem
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  Health Insurance, Term Plans & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    Preventive Health Packages.
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  We provide 100% cashless retail health insurance, ₹1 Crore+ pure term life plans, policy deduction audits, and comprehensive preventive full-body health checkup packages at network hospitals.
                </p>

                {/* Service Cards Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div 
                    onClick={() => openForm('audit', 'New Health Insurance (Zero Co-Pay)')}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={18} />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">Cashless Health Plans</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">No room-rent capping, 100% cashless hospital network, zero co-pay options.</p>
                  </div>

                  <div 
                    onClick={() => openForm('audit', 'Term Life Protection (₹1 Cr+ Coverage)')}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Activity size={18} />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">Pure Term Plans</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">Income security for family with critical illness riders and tax benefits under 80C.</p>
                  </div>

                  <div 
                    onClick={() => openForm('package', 'Comprehensive Full Body Health Package')}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <PackageCheck size={18} />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">Health Packages</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">65+ blood tests, Cardiac ECG, Vitamin profiles & doctor consultation from ₹999.</p>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => openForm('audit', 'Explore Health & Term Plans')}
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
                  >
                    Explore Plans & Free Audit <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openForm('package', 'Book Preventive Health Package')}
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Stethoscope size={16} className="text-cyan-400" /> Book Health Package
                  </button>
                </div>
              </div>
            )}

            {/* STAFFING TAB */}
            {activeTab === 'staffing' && (
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <Users size={14} /> NABH-Trained Clinical & Auxiliary Force
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  Certified Hospital Staffing & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Bio-Sterile Pest Management.
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  Verified ICU/Ward Nurses, General Duty Attendants (GDAs), Male/Female Aayas, Ex-Servicemen Security Marshals, and specialized hospital pest decontamination for NABH nursing homes.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => openForm('staffing', 'Hospital Staffing / Nurses / GDAs')}
                    className="px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
                  >
                    Hire Staff / Book Facility Service <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openForm('staffing', 'Bio-Pest Control Protocol')}
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    View Staffing Protocols
                  </button>
                </div>
              </div>
            )}

            {/* FUNDS TAB */}
            {activeTab === 'funds' && (
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <BadgePercent size={14} /> Instant Hospital Billing Credit
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  Emergency Medical Loans at <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                    Minimal Interest Rates.
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  No medical treatment should stop for want of funds. Instant ₹50,000 to ₹10 Lakhs healthcare credit sanctioned in 15 minutes through RBI-regulated Banks & NBFC partners. Zero collateral required.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => openForm('loan', 'Emergency Medical Credit')}
                    className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
                  >
                    Check Loan Eligibility in 2 Mins <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openForm('call', 'Urgent 24/7 Helpline Callback')}
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <PhoneCall size={16} className="text-amber-400" /> 24/7 Desk Helpline
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Thumbnail Dossier */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
              <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                <img 
                  src={
                    activeTab === 'corporate'
                      ? 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
                      : activeTab === 'customer'
                      ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
                      : activeTab === 'staffing'
                      ? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
                      : 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="MediBridge Facility"
                  className="w-full h-full object-cover brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Network
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                    {activeTab === 'corporate' && 'Institutional Gateway • NHCX'}
                    {activeTab === 'customer' && 'Health Plans • Term Life • Health Packages'}
                    {activeTab === 'staffing' && 'NABH Trained Personnel Unit'}
                    {activeTab === 'funds' && '15-Min NBFC Credit Line'}
                  </span>
                  <p className="text-sm font-black text-white truncate">
                    {activeTab === 'corporate' && 'Mid-Size Hospital Revenue Ops'}
                    {activeTab === 'customer' && 'Individual Protection Suite'}
                    {activeTab === 'staffing' && 'Clinical Staff & Bio-Pest Suite'}
                    {activeTab === 'funds' && 'Emergency Medical Loans'}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">
                    <strong className="text-white">Active Geography:</strong> Deploying across Delhi NCR, Haryana & Punjab mid-sized hospitals (50–300 beds).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">
                    <strong className="text-white">Full-Stack Care:</strong> 24+ private TPAs, CGHS, and state public health exchanges.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300">
                    <strong className="text-white">Instant Credit:</strong> Minimal interest rate medical loans with RBI-regulated NBFC partners.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openForm('management', 'Executive Management Partnership')}
                  className="w-full mt-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer shadow-md"
                >
                  <FileText size={14} className="text-cyan-400" /> Connect with Management Desk
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* POPUP MODAL 1: HEALTH & TERM INSURANCE CONSULTATION */}
      {activeModal === 'audit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Advisory Request Registered</h3>
                <p className="text-xs text-slate-300">Our certified health & term insurance specialist will call you with customized quotes and deduction analysis.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleLeadSubmit(e, 'Customer')} className="space-y-3.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Health & Term Advisory Desk</span>
                <h3 className="text-xl font-bold text-white">Compare & Port Policies</h3>
                <p className="text-xs text-slate-400 mb-4">Choose 100% cashless plans with no room-rent capping or calculate your term life protection.</p>

                <select
                  value={formData.subType}
                  onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="New Comprehensive Health Insurance">New Health Insurance (Zero Co-Pay)</option>
                  <option value="Port Existing Health Policy">Port Existing Policy (Remove Cappings)</option>
                  <option value="Pure Term Life Protection Plan (₹1 Cr+)">Pure Term Plan (₹1 Crore+ Cover)</option>
                  <option value="Senior Citizen Health Insurance">Senior Citizen Health Insurance</option>
                  <option value="Critical Illness Add-on Rider">Critical Illness Add-on Rider</option>
                </select>

                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <input
                  type="tel"
                  required
                  placeholder="Contact Mobile Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <input
                  type="text"
                  placeholder="Current Insurer (If porting, e.g. Star, HDFC, Care)"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Get Instant Plan Quotes'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: PREVENTIVE HEALTH CHECKUP PACKAGES */}
      {activeModal === 'package' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={40} className="text-cyan-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Health Package Slot Booked</h3>
                <p className="text-xs text-slate-300">Our diagnostics desk will confirm your preferred appointment time and hospital center.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleLeadSubmit(e, 'Customer')} className="space-y-3.5">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Preventive Diagnostics</span>
                <h3 className="text-xl font-bold text-white">Book Hospital Health Package</h3>
                <p className="text-xs text-slate-400 mb-4">Select accredited hospital diagnostic package with doctor consultation.</p>

                <select
                  value={formData.subType}
                  onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="MediBridge Essential Full Body (60+ Tests) - ₹999">Essential Full Body (60+ Tests, CBC, LFT, KFT, Lipids) - ₹999</option>
                  <option value="MediBridge Comprehensive Cardiac & Diabetic Package - ₹1,999">Cardiac & Diabetic Care (Includes ECG & HbA1c) - ₹1,999</option>
                  <option value="MediBridge Senior Citizen Vital Health Package - ₹2,999">Senior Citizen Comprehensive (Includes Bone Density & USG) - ₹2,999</option>
                  <option value="Executive Cancer Screening & Full Profile - ₹4,999">Executive Full Diagnostic & Tumor Marker Screening - ₹4,999</option>
                </select>

                <input
                  type="text"
                  required
                  placeholder="Patient / Person Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <input
                  type="tel"
                  required
                  placeholder="Mobile Number for Booking Confirmation *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  placeholder="City / Area (e.g. Gurugram, Delhi, Faridabad)"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Booking Slot...' : 'Confirm Package Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL 3: STAFFING */}
      {activeModal === 'staffing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={40} className="text-indigo-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Staffing Requirement Registered</h3>
                <p className="text-xs text-slate-300">Our hospital workforce manager will contact you with NABH personnel deployment timelines.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleLeadSubmit(e, 'Staffing')} className="space-y-3.5">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Hospital Auxiliary Division</span>
                <h3 className="text-xl font-bold text-white">Hire Staff & Facility Services</h3>
                <p className="text-xs text-slate-400 mb-4">Deploy verified ICU nurses, GDAs, Aayas, or schedule hospital pest control.</p>

                <input
                  type="text"
                  required
                  placeholder="Hospital / Nursing Home Name *"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  required
                  placeholder="Contact Person & Designation *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="tel"
                  required
                  placeholder="Mobile Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <select
                  value={formData.subType}
                  onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ICU / Ward Nurses">ICU / Ward Nurses</option>
                  <option value="GDA / Patient Attendants">General Duty Attendants (GDAs)</option>
                  <option value="Male / Female Aayas">Male / Female Aayas</option>
                  <option value="Hospital Security Marshals">Security Marshals (Ex-Army)</option>
                  <option value="NABH Bio-Pest Control">Hospital Bio-Pest Decontamination</option>
                </select>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Request Deployment Quotation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL 4: EMERGENCY LOANS */}
      {activeModal === 'loan' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={40} className="text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Eligibility Check Initiated</h3>
                <p className="text-xs text-slate-300">Our NBFC loan desk has received your details. Expect a call within 10 minutes to sanction medical credit.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleLeadSubmit(e, 'Emergency Loan')} className="space-y-3.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Minimal Interest Medical Credit</span>
                <h3 className="text-xl font-bold text-white">Check Instant Loan Eligibility</h3>
                <p className="text-xs text-slate-400 mb-4">₹50,000 to ₹10 Lakhs sanctioned in 15 minutes. Direct payment to hospital billing counter.</p>

                <input
                  type="text"
                  required
                  placeholder="Patient / Applicant Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />

                <input
                  type="tel"
                  required
                  placeholder="Applicant Mobile Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />

                <input
                  type="text"
                  placeholder="Hospital Name where Admitted"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />

                <input
                  type="text"
                  placeholder="Estimated Bill / Required Amount (e.g. ₹1.5 Lakhs)"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Checking...' : 'Check Loan Eligibility in 2 Mins'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL 5: CONNECT MANAGEMENT */}
      {activeModal === 'management' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={40} className="text-cyan-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Management Dossier Dispatched</h3>
                <p className="text-xs text-slate-300">Our regional director will connect with your executive office directly.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleLeadSubmit(e, 'Corporate')} className="space-y-3.5">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Executive Gateway</span>
                <h3 className="text-xl font-bold text-white">Connect with Management Desk</h3>
                <p className="text-xs text-slate-400 mb-4">Direct discussion for hospital partnerships, TPA outsourcing, and corporate empanelment.</p>

                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  required
                  placeholder="Hospital / Institution / Company Name *"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <input
                  type="tel"
                  required
                  placeholder="Direct Mobile / WhatsApp Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Connecting...' : 'Request Direct Management Call'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL 6: 24/7 HELPLINE */}
      {activeModal === 'call' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <PhoneCall size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">24/7 MediBridge Central Desk</h3>
            <p className="text-xs text-slate-400 mb-4">Direct helpline for emergency admission intimation and urgent loans.</p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xl font-bold text-cyan-400 mb-4 select-all">
              +91 76690 17779
            </div>

            <p className="text-[11px] text-slate-400 mb-4">You can dial this number directly from your phone or leave your callback request below:</p>

            <form onSubmit={(e) => handleLeadSubmit(e, 'Emergency Loan')} className="space-y-3">
              <input
                type="tel"
                required
                placeholder="Enter your phone for instant callback"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                Request 5-Min Callback
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}