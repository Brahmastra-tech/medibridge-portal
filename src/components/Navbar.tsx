import { useState, useEffect } from 'react';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Products', href: '#products' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Hospitals', href: '#b2b' },
    { label: 'Revenue Calculator', href: '#calculator' },
    { label: 'Auto-Recon', href: '#reconciliation' },
    { label: 'Find Hospitals', href: '#hospitals' },
    { label: 'Track Claim', href: '#claims' },
    { label: 'Emergency', href: '#emergency' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#061224]/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/30 rounded-lg blur-md group-hover:bg-cyan-400/50 transition-colors" />
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#061224]" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                MediBridge
              </span>
              <span className="text-cyan-400/80 text-[10px] font-semibold tracking-widest uppercase">Health</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors rounded-lg hover:bg-cyan-500/5 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Header Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#b2b"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              Request Demo <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="xl:hidden pb-5 pt-2 space-y-1 bg-[#061224]/95 border-b border-slate-800 rounded-b-2xl px-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 px-2">
              <a
                href="#b2b"
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                Request Demo <ArrowRight size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}