// src/components/ModernHero.tsx
import React from 'react';
import { ShieldCheck, ArrowRight, Activity, Building2, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  onOpenModal: (module: 'EMP' | 'STAFF' | 'FIN' | 'FAC' | 'HOS', title: string) => void;
  onExploreRecon: () => void;
  onSelectAudience: (aud: 'hospitals' | 'individuals' | 'professionals') => void;
  activeAudience: 'hospitals' | 'individuals' | 'professionals';
}

export const ModernHero: React.FC<Props> = ({ 
  onOpenModal, 
  onExploreRecon, 
  onSelectAudience, 
  activeAudience 
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F9FF] via-[#F8FAFC] to-white pt-10 pb-20 border-b border-slate-200">
      {/* Decorative soft gradients */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Audience Toggle Tabs (Clario Pill Style) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-full bg-white shadow-sm border border-slate-200/80">
            <button
              onClick={() => onSelectAudience('hospitals')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeAudience === 'hospitals'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hospitals & Networks
            </button>
            <button
              onClick={() => onSelectAudience('individuals')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeAudience === 'individuals'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Individuals & Families
            </button>
            <button
              onClick={() => onSelectAudience('professionals')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeAudience === 'professionals'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Workforce Careers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Clear Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/70 text-cyan-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>National Healthcare Operating Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              A smarter way <br className="hidden sm:inline" />
              to manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">hospital care</span> & revenue.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Accelerate cash-flow, eliminate insurance claim deductions, and automate TPA empanelment through Rohini-verified healthcare intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenModal('EMP', 'Partner Hospital Empanelment')}
                className="px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2 group"
              >
                <span>Empanel Hospital</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreRecon}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
              >
                <span>Auto-Recon Demo</span>
                <Zap className="w-4 h-4 text-cyan-600" />
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-4 flex items-center gap-6 border-t border-slate-200/80">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">AB</div>
                <div className="w-8 h-8 rounded-full bg-cyan-700 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">FM</div>
                <div className="w-8 h-8 rounded-full bg-teal-700 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">MD</div>
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>98.6% Verification Rate</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-slate-500 text-[11px]">Strict Rohini ID validation across 2,400+ network nodes</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Clario-style Floating Cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Center Visual Mockup Container */}
            <div className="relative w-full max-w-md bg-gradient-to-tr from-cyan-100 to-slate-100 rounded-3xl p-3 border border-cyan-200/60 shadow-2xl">
              <div className="w-full h-96 rounded-2xl bg-white overflow-hidden relative flex flex-col justify-end p-6 border border-slate-100 shadow-inner">
                
                {/* Background medical illustration elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80" 
                  alt="Clinical Director" 
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />

                {/* Sub-text over portrait */}
                <div className="relative z-20 text-white">
                  <div className="text-xs uppercase tracking-widest text-cyan-300 font-mono">Healthcare OS</div>
                  <div className="text-xl font-bold mt-0.5">Apollo Multispeciality</div>
                  <div className="text-xs text-slate-300 font-mono">ROHINI-892101 • Accredited</div>
                </div>
              </div>

              {/* Floating Telemetry Card 1 (Bottom-Left) */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 max-w-[210px] z-30">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Settlement Rate</span>
                </div>
                <div className="text-2xl font-black text-slate-900">98.4%</div>
                <p className="text-[10px] text-slate-500 mt-1">Faster UTR matching against TPA deductions</p>
              </div>

              {/* Floating Telemetry Card 2 (Top-Right) */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-slate-100 z-30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Rohini Certified</div>
                  <div className="text-[10px] text-emerald-600 font-medium">NHA Registry Synchronized</div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};