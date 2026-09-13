// src/components/HowItWorksStrip.tsx
import React from 'react';
import { Building2, FileSpreadsheet, RefreshCw } from 'lucide-react';

export const HowItWorksStrip: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">STREAMLINED ADOPTION</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">How SanjeetMedi Operates</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center mx-auto text-base font-bold shadow-md shadow-cyan-600/20 mb-4">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900">Rohini ID Validation</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Every hospital onboarding and query is bound to verified National Registry Rohini credentials, preventing identity spoofing.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto text-base font-bold shadow-md shadow-slate-900/20 mb-4">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900">Empanelment & RCM Sync</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Ingest claims, track pre-auth approvals across AB-PMJAY, CGHS, and private insurers with automated query clearance.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto text-base font-bold shadow-md shadow-emerald-600/20 mb-4">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900">Auto-Reconciliation & Recovery</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Bank UTR receipts are auto-matched against payer deductions in real time, routing variances directly into recovery workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};