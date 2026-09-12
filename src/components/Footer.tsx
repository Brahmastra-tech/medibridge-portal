import { Activity, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#061224]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#061224]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  MediBridge Health
                </span>
                <span className="text-cyan-400/70 text-[10px] font-medium tracking-widest uppercase">
                  TPA &amp; Claims Acceleration
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              India's smart TPA coordination and claims recovery platform — bridging
              hospitals, patients, and insurers for faster cashless approvals and
              maximized revenue recovery.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#b2b" className="text-slate-400 hover:text-cyan-300 transition-colors">TPA Helpdesk</a></li>
              <li><a href="#b2b" className="text-slate-400 hover:text-cyan-300 transition-colors">AR Recovery</a></li>
              <li><a href="#hospitals" className="text-slate-400 hover:text-cyan-300 transition-colors">Network Hospitals</a></li>
              <li><a href="#claims" className="text-slate-400 hover:text-cyan-300 transition-colors">Claim Tracking</a></li>
              <li><a href="#emergency" className="text-slate-400 hover:text-cyan-300 transition-colors">Emergency Intimation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                +91 76690 17779
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                support@medibridgehealth.com
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Bengaluru, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            &copy; 2026 MediBridge Health. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-slate-500 text-xs">
              24/7 TPA Coordination &amp; Emergency Support
            </p>
            <a href="/admin" className="text-slate-600 hover:text-cyan-400 text-xs transition-colors">
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
