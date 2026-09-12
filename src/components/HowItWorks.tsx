import React from 'react';
import { FileUp, Cpu, Network, MapPin, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Drop the File.',
      desc: 'Excel, CSV, or the PDF payment advice your TPA emailed. MediBridge reads any hospital billing export directly—no remapping, zero IT setup required.',
      badge: 'Zero Configuration'
    },
    {
      num: '02',
      title: 'AI Parses Each Line.',
      desc: 'Our engine extracts Patient IDs, procedure codes, deductions, and co-pays—even if your billing format changes weekly. Every discrepancy is flagged.',
      badge: 'Deep Disallowance Audit'
    },
    {
      num: '03',
      title: 'Reconcile with Payors.',
      desc: 'Direct match against NHCX, CGHS, ECHS, and 24+ private TPA settlement feeds to detect uncredited UTRs and initiate automated dispute letters.',
      badge: 'Bank UTR Settlement'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#050f1e] text-white border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Geographic Onboarding Banner */}
        <div className="mb-14 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <MapPin className="text-cyan-400 shrink-0" size={20} />
            <p className="text-xs sm:text-sm text-slate-200">
              <strong className="text-white">Active Onboarding Hub:</strong> Currently deploying on-premise & remote TPA desks across <span className="text-cyan-300 font-semibold">Delhi NCR, Haryana, and Punjab</span> mid-sized hospitals (50–300 beds).
            </p>
          </div>
          <a
            href="#b2b"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs whitespace-nowrap transition-all shadow-md"
          >
            Partner Hospital
          </a>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
            How MediBridge Works
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3">
            From file ingestion to bank settlement recovery in three seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-5xl font-black text-cyan-400/30 italic font-serif block mb-4">
                  {step.num}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full mb-3 inline-block">
                  {step.badge}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 size={15} className="text-emerald-400" /> Fully Automated Flow
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}