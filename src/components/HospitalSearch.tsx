import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Building2, Phone, Bed, Stethoscope, X } from 'lucide-react';
import { supabase, type Hospital } from '@/lib/supabase';

export default function HospitalSearch() {
  const [query, setQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Hospital | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setHospitals([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .or(`name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%,specialties.ilike.%${q}%`)
      .limit(20);
    setLoading(false);
    if (error) {
      console.error('Search error:', error);
      return;
    }
    setHospitals((data as Hospital[]) || []);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <section id="hospitals" className="relative py-24 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-4">
            <Building2 className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-cyan-300 text-xs font-medium tracking-wide">Network Hospitals</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Find <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">Cashless Network Hospitals</span>
          </h2>
          <p className="text-slate-400 text-base">
            Search by hospital name, city, state, or specialty across our nationwide network.
          </p>
        </div>

        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hospitals, cities, or specialties..."
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm placeholder-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        )}

        {!loading && query.length >= 2 && hospitals.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No hospitals found for "{query}". Try a different search.
          </div>
        )}

        {!loading && query.length < 2 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            Start typing to search our network of cashless hospitals.
          </div>
        )}

        {!loading && hospitals.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {hospitals.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelected(h)}
                className="text-left rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:border-cyan-400/30 hover:bg-white/8 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">
                      {h.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                      <MapPin className="w-3 h-3" />
                      {h.city}, {h.state}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[10px] font-medium">
                    {h.network_type}
                  </span>
                </div>
                {h.specialties && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Stethoscope className="w-3 h-3" />
                    <span className="line-clamp-1">{h.specialties}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Hospital detail modal */}
        {selected && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#061224] border border-cyan-400/20 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-cyan-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selected.name}
              </h3>
              <div className="flex items-center gap-1 text-slate-400 text-sm mb-4">
                <MapPin className="w-3.5 h-3.5" />
                {selected.city}, {selected.state}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <span className="text-cyan-400 text-xs font-bold">{selected.network_type === 'Cashless' ? 'C' : 'N'}</span>
                  </div>
                  <span className="text-slate-300 text-sm">{selected.network_type} Network</span>
                </div>
                {selected.specialties && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{selected.specialties}</span>
                  </div>
                )}
                {selected.beds != null && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Bed className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{selected.beds} beds</span>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{selected.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
