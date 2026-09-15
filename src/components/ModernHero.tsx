// src/components/ModernHero.tsx
import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';

interface ModernHeroProps {
  onOpenModal: () => void;
  onExploreRecon: () => void;
  onSelectAudience: (aud: 'hospitals' | 'individuals' | 'staffing') => void;
  activeAudience: 'hospitals' | 'individuals' | 'staffing';
}

export function ModernHero({ onOpenModal, onExploreRecon, onSelectAudience, activeAudience }: ModernHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white py-16 lg:py-24 border-b border-slate-200">
      {/* Background glow blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO GRID CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>National Healthcare Operating Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              A smarter way <br />
              to manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">hospital care & revenue.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              Accelerate cash-flow, eliminate insurance claim deductions, and automate TPA empanelment through Rohini-verified healthcare intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenModal}
                className="px-7 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Empanel Hospital</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreRecon}
                className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xl shadow-slate-900/20 flex items-center gap-2 transition-all"
              >
                <span>Auto-Recon Demo</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">AB</div>
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">FM</div>
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">MD</div>
                </div>
                <span><strong>98.6% Verification Rate</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <span>Strict Rohini ID validation across 2,400+ network nodes</span>
            </div>

          </div>

          {/* RIGHT COLUMN - PROFESSIONAL FEMALE DOCTOR & COMPLETE MEDICAL TEAM PHOTO CARD */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 overflow-hidden">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Rohini Certified OS</h4>
                    <p className="text-[10px] text-slate-400 font-mono">NHA Registry Synchronized</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                  LIVE SECURE
                </span>
              </div>

              {/* REAL PHOTO: FEMALE DOCTOR & COMPLETE MEDICAL TEAM BACKGROUND */}
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 group shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop" 
                  alt="Professional Female Doctor & Complete Medical Team" 
                  className="w-full h-56 object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-left">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">ENTERPRISE HEALTHCARE EXPERTS</span>
                  <h3 className="text-base font-black text-white">Specialized Clinical & RCM Team</h3>
                  <p className="text-[11px] text-slate-300">Delivering 24/7 Multi-Specialty Hospital Operations & Claim Assurance</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">PRE-AUTH SPEED</span>
                  <p className="text-base font-black text-cyan-400 mt-0.5">30 Mins</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">SETTLEMENT RATE</span>
                  <p className="text-base font-black text-emerald-400 mt-0.5">98.4%</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}