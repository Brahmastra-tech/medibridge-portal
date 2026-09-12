import React from 'react';
import { Zap, FileSpreadsheet, ShieldCheck, Banknote, ArrowRight } from 'lucide-react';

export default function ProductSuite() {
  const products = [
    {
      title: 'MediBridge Desk OS',
      tagline: 'Turnkey TPA Hospital Helpdesk',
      desc: 'Dedicated on-premise or cloud-integrated claim executives managing cashless pre-auth, active doctor queries, and discharge settlements.',
      icon: Zap,
      accent: 'border-cyan-500/30 text-cyan-400'
    },
    {
      title: 'Auto-Recon AI Engine',
      tagline: 'Multi-Payer Ledger Reconciliation',
      desc: 'Parses complex payment advice across 24+ TPAs, matches bank UTRs with hospital HIS invoices, and flags short-settled dues.',
      icon: FileSpreadsheet,
      accent: 'border-teal-500/30 text-teal-400'
    },
    {
      title: 'Disallowance Recovery Desk',
      tagline: 'Zero-Fee Legal & Ombudsman Filing',
      desc: 'Direct dispute escalation for wrongful deductions, unfair medical capping, and repudiated high-value surgical claims.',
      icon: Banknote,
      accent: 'border-amber-500/30 text-amber-400'
    },
    {
      title: 'Public Payor & NHCX Gateway',
      tagline: 'Govt Schemes Specialization',
      desc: 'Optimized claim packaging for Ayushman Bharat (ABDM), CGHS, and Haryana/Punjab state employee schemes.',
      icon: ShieldCheck,
      accent: 'border-indigo-500/30 text-indigo-400'
    }
  ];

  return (
    <section id="products" className="py-24 bg-[#071328] text-white border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
            Product Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
            Engineered for Modern Hospital Revenue Cycles
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3">
            Modular healthcare finance products built to plug into your existing billing setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-5 ${item.accent}`}>
                    <IconComponent size={24} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {item.tagline}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Enterprise Ready</span>
                  <a
                    href="#b2b"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    Request Evaluation <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}