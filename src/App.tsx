// src/App.tsx
import React, { useState } from 'react';
import { 
  Building2, User, Briefcase, Shield, FileCheck2, 
  BarChart3, Users, Bug, Wallet, ChevronRight 
} from 'lucide-react';
import { ModernHero } from './components/ModernHero';
import { HowItWorksStrip } from './components/HowItWorksStrip';
import { AutoReconShowcase } from './components/AutoReconShowcase';
import { HospitalDashboard } from './components/HospitalDashboard';
import { HospitalRequestModal } from './components/HospitalRequestModal';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'hospital-dashboard'>('home');
  const [activeAudience, setActiveAudience] = useState<'hospitals' | 'individuals' | 'professionals'>('hospitals');
  const [modalConfig, setModalConfig] = useState<{ open: boolean; module: 'EMP' | 'STAFF' | 'FIN' | 'FAC' | 'HOS'; title: string }>({
    open: false,
    module: 'HOS',
    title: 'Hospital Operations Request'
  });

  const openModal = (module: 'EMP' | 'STAFF' | 'FIN' | 'FAC' | 'HOS', title: string) => {
    setModalConfig({ open: true, module, title });
  };

  const scrollToRecon = () => {
    const el = document.getElementById('recon-demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (currentView === 'hospital-dashboard') {
    return (
      <HospitalDashboard 
        onBackToHome={() => setCurrentView('home')}
        onOpenModal={(module, title) => setModalConfig({ open: true, module, title })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-cyan-500 selection:text-white antialiased">
      
      {/* 1. TOP HEADER (CLEAN APPLE/CLARIO STYLE) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-cyan-600/30">
              SM
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">SANJEET<span className="text-cyan-600">MEDI</span></span>
              <span className="text-[9px] text-slate-500 font-mono tracking-wider mt-0.5">HEALTHCARE OS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600">
            <button onClick={() => setActiveAudience('hospitals')} className={activeAudience === 'hospitals' ? 'text-cyan-700 font-bold' : 'hover:text-slate-900'}>Hospitals</button>
            <button onClick={() => setActiveAudience('individuals')} className={activeAudience === 'individuals' ? 'text-cyan-700 font-bold' : 'hover:text-slate-900'}>Individuals</button>
            <button onClick={() => setActiveAudience('professionals')} className={activeAudience === 'professionals' ? 'text-cyan-700 font-bold' : 'hover:text-slate-900'}>Workforce</button>
            <button onClick={scrollToRecon} className="hover:text-slate-900">Auto-Reconciliation</button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('hospital-dashboard')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Rohini Login</span>
            </button>
            <button 
              onClick={() => openModal('EMP', 'Partner Hospital Empanelment')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-all shadow-sm shadow-cyan-600/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* 2. MODERN LIGHT HERO (CLARIO STYLE) */}
      <ModernHero 
        onOpenModal={openModal}
        onExploreRecon={scrollToRecon}
        onSelectAudience={(aud) => setActiveAudience(aud)}
        activeAudience={activeAudience}
      />

      {/* 3. HOW IT WORKS 3-STEP FLOW */}
      <HowItWorksStrip />

      {/* 4. HOSPITAL ENTERPRISE CORE (CLEAN GRID) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-700">B2B SOLUTIONS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Enterprise Hospital Suite</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 md:mt-0">
              Identity-backed operations for accredited healthcare organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">01. Empanelment & Network Access</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ayushman Bharat (PM-JAY), CGHS, ECHS, State Health Schemes & Corporate TPAs.
                </p>
              </div>
              <button onClick={() => openModal('EMP', 'Empanelment Request')} className="mt-6 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                Apply for Empanelment <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">02. Revenue Cycle & Claims (RCM)</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Pre-authorisation coordination, claims compilation, query clearance, and denial recovery.
                </p>
              </div>
              <button onClick={scrollToRecon} className="mt-6 text-xs font-bold text-cyan-600 flex items-center gap-1 hover:underline">
                Explore Auto-Reconciliation <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">03. Healthcare Accounts Receivable</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ageing buckets analysis, overdue payer follow-ups, and unallocated UTR reconciliation.
                </p>
              </div>
              <button onClick={() => openModal('HOS', 'Accounts Receivable Audit')} className="mt-6 text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline">
                Audit Overdue AR <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">04. Hospital Workforce & Staffing</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Clinical staffing for ICU/OT nurses, GNM/ANM, housekeeping, and front-desk admins.
                </p>
              </div>
              <button onClick={() => openModal('STAFF', 'Workforce Staffing Requisition')} className="mt-6 text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline">
                Raise Staffing Requisition <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                  <Bug className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">05. Facility Pest AMC</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Healthcare-grade pest control and disinfection contracts compliant with NABH norms.
                </p>
              </div>
              <button onClick={() => openModal('FAC', 'Pest AMC Request')} className="mt-6 text-xs font-bold text-teal-600 flex items-center gap-1 hover:underline">
                Schedule Facility Audit <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 6 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">06. Healthcare Institutional Finance</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Connect eligible hospitals with Banks and NBFC partners for working capital & equipment loans.
                </p>
              </div>
              <button onClick={() => openModal('FIN', 'Institutional Financing Support')} className="mt-6 text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                Connect With Partners <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINTECH CONTRAST SECTION: AUTO-RECONCILIATION DEMO (CareCred Dark Theme) */}
      <section id="recon-demo" className="py-20 bg-[#030712] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">FINTECH MEETS HEALTHCARE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">From Claims to Cash. Automatically.</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Automated reconciliation matches hospital claims, TPA settlements, and bank UTRs with variance detection.
            </p>
          </div>

          <AutoReconShowcase />
        </div>
      </section>

      {/* 6. CLEAN MINIMAL FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px]">SM</div>
            <span className="text-slate-900 font-bold">SANJEETMEDI TECH</span>
            <span>•</span>
            <span>Healthcare Operating Infrastructure</span>
          </div>
          <p>© 2026 SanjeetMedi. All rights reserved. Rohini ID verified workflows.</p>
        </div>
      </footer>

      {/* Universal Request Modal */}
      <HospitalRequestModal
        isOpen={modalConfig.open}
        onClose={() => setModalConfig({ ...modalConfig, open: false })}
        defaultModule={modalConfig.module}
        moduleTitle={modalConfig.title}
      />
    </div>
  );
}

export default App;