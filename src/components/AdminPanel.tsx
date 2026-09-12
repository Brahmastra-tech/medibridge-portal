import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { exportToExcel, exportToPDF } from '../lib/exportUtils';
import * as XLSX from 'xlsx';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Users, AlertTriangle, Building2, FileSpreadsheet, BarChart3, Settings as SettingsIcon, 
  Download, Plus, Trash2, Sun, Moon, UploadCloud, RefreshCw, Key, ShieldCheck, 
  ExternalLink, Phone, Mail, CheckCircle2, Layers, BadgePercent, ArrowUpRight
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'master_leads' | 'emergency' | 'directory' | 'claims' | 'audits' | 'settings'>('analytics');
  const [darkMode, setDarkMode] = useState(true);

  // Stored Password
  const [savedPassword, setSavedPassword] = useState(() => localStorage.getItem('mb_admin_password') || 'admin123');
  const [newPassword, setNewPassword] = useState('');

  // Data states
  const [masterLeads, setMasterLeads] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [claimAudits, setClaimAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [leadFilter, setLeadFilter] = useState<string>('All');

  // New Hospital Form Inputs
  const [newHosp, setNewHosp] = useState({ name: '', city: '', state: '', phone: '' });

  // Fetch all live tables from Supabase
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [mRes, eRes, hRes, cRes, aRes] = await Promise.all([
        supabase.from('master_leads').select('*').order('created_at', { ascending: false }),
        supabase.from('emergency_intimations').select('*').order('created_at', { ascending: false }),
        supabase.from('cashless_hospitals').select('*').order('created_at', { ascending: false }),
        supabase.from('claims_tracker').select('*').order('updated_at', { ascending: false }),
        supabase.from('claim_audits').select('*').order('created_at', { ascending: false })
      ]);

      if (mRes.data) setMasterLeads(mRes.data);
      if (eRes.data) setEmergencies(eRes.data);
      if (hRes.data) setHospitals(hRes.data);
      if (cRes.data) setClaims(cRes.data);
      if (aRes.data) setClaimAudits(aRes.data);

    } catch (err: any) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      fetchAllData();
    }
  }, [authed]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === savedPassword) {
      setAuthed(true);
    } else {
      alert('Incorrect admin password! (Default: admin123)');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.trim().length < 4) {
      alert('Password must be at least 4 characters long');
      return;
    }
    localStorage.setItem('mb_admin_password', newPassword.trim());
    setSavedPassword(newPassword.trim());
    setNewPassword('');
    alert('Admin security password updated successfully!');
  };

  // Lead Status Update
  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('master_leads').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setMasterLeads(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // CRUD: Add Hospital
  const handleAddHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHosp.name.trim()) {
      alert('Hospital Name is required');
      return;
    }

    const { error } = await supabase.from('cashless_hospitals').insert([{
      name: newHosp.name.trim(),
      city: newHosp.city.trim() || 'Delhi NCR',
      state: newHosp.state.trim() || 'North Region',
      contact_phone: newHosp.phone.trim() || 'Desk Helpline',
      specialties: ['General Cashless', 'TPA Desk', 'Emergency Credit']
    }]);

    if (!error) {
      alert(`Hospital "${newHosp.name}" added successfully!`);
      setNewHosp({ name: '', city: '', state: '', phone: '' });
      fetchAllData();
    } else {
      alert('Database Insert Error: ' + error.message);
    }
  };

  // CRUD: Delete Hospital
  const handleDeleteHospital = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from network directory?`)) return;
    const { error } = await supabase.from('cashless_hospitals').delete().eq('id', id);
    if (!error) {
      fetchAllData();
    } else {
      alert('Delete Error: ' + error.message);
    }
  };

  // Claims Batch CSV/Excel Upload
  const handleClaimsBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawData || rawData.length === 0) {
          alert('Uploaded file is empty.');
          return;
        }

        const formatted = rawData.map((row, idx) => ({
          claim_id: String(row.ClaimID || row['Claim ID'] || row.claim_id || `MB-${Date.now()}-${idx}`),
          patient_name: String(row.PatientName || row['Patient Name'] || row.patient_name || 'Admitted Patient'),
          hospital_name: String(row.HospitalName || row['Hospital Name'] || row.hospital_name || 'Network Hospital'),
          status: String(row.Status || row.status || 'Pre-Auth Approved'),
          claimed_amount: Number(row.ClaimedAmount || row['Claimed Amount'] || row.claimed_amount || 0),
          approved_amount: Number(row.ApprovedAmount || row['Approved Amount'] || row.approved_amount || 0),
        }));

        const { error } = await supabase.from('claims_tracker').upsert(formatted, { onConflict: 'claim_id' });
        if (!error) {
          alert(`Success: ${formatted.length} insurance claims synced in Master Tracker!`);
          fetchAllData();
        } else {
          alert('Import Error: ' + error.message);
        }
      } catch (err: any) {
        alert('File parsing error: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Login Gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#040d1a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">MediBridge Command Center</h2>
          <p className="text-xs text-slate-400 mb-6">Enter institutional passkey to unlock operational databases.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin Password (default: admin123)" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm" 
            />
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Analytics Computation
  const filteredLeads = leadFilter === 'All' 
    ? masterLeads 
    : masterLeads.filter(l => l.category?.toLowerCase() === leadFilter.toLowerCase());

  const leadDistribution = [
    { name: 'Corporate (Hospitals)', value: masterLeads.filter(l => l.category === 'Corporate').length || 1, color: '#06B6D4' },
    { name: 'Staffing & Pest Control', value: masterLeads.filter(l => l.category === 'Staffing').length || 1, color: '#6366F1' },
    { name: 'Emergency Loans', value: masterLeads.filter(l => l.category === 'Emergency Loan').length || 1, color: '#F59E0B' },
    { name: 'Individuals/Insurance', value: masterLeads.filter(l => l.category === 'Customer').length || 1, color: '#10B981' }
  ];

  const totalArDebt = claimAudits.reduce((sum, item) => sum + (Number(item.pending_amount) || 0), 0);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#040d1a] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r p-5 flex flex-col justify-between shrink-0 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <div className="flex items-center justify-between pb-6 border-b dark:border-slate-800">
            <div>
              <span className="font-black text-xl tracking-tight text-cyan-400">MediBridge</span>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Admin Desk</span>
            </div>
            <button 
              type="button"
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-xl border dark:border-slate-700 hover:bg-slate-800/20"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <nav className="space-y-1.5 mt-6">
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${activeTab === 'analytics' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}>
              <BarChart3 size={17} /> Analytics & Reports
            </button>
            <button onClick={() => setActiveTab('master_leads')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${activeTab === 'master_leads' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}>
              <Users size={17} /> Master Inquiries ({masterLeads.length})
            </button>
            <button onClick={() => setActiveTab('emergency')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${activeTab === 'emergency' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}>
              <AlertTriangle size={17} className="text-rose-400" /> Emergency Alerts ({emergencies.length})
            </button>
            <button onClick={() => setActiveTab('audits')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${activeTab === 'audits' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}>
              <FileSpreadsheet size={17} /> Auto-Recon Files ({claimAudits.length})
            </button>
            <button onClick={() => setActiveTab('directory')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${activeTab === 'directory' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}>
              <Building2 size={17} /> Network Hospitals ({hospitals.length})
            </button>
            <button onClick={() => setActiveTab('claims')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${activeTab === 'claims' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}>
              <ShieldCheck size={17} /> Claims Tracker ({claims.length})
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'}`}>
              <SettingsIcon size={17} /> Settings
            </button>
          </nav>
        </div>

        <div className="space-y-2">
          <button onClick={fetchAllData} className="w-full flex items-center justify-center gap-2 p-2.5 border dark:border-slate-800 rounded-xl text-xs text-slate-400 hover:text-white transition-all cursor-pointer">
            <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} /> {loading ? 'Syncing...' : 'Live Refresh Sync'}
          </button>
          <button onClick={() => setAuthed(false)} className="w-full text-center text-xs text-rose-400 hover:underline py-1 cursor-pointer">
            Lock Portal (Logout)
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        
        {/* TAB 1: EXECUTIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">MediBridge Executive Analytics</h1>
                <p className="text-xs text-slate-400 mt-1">Multi-segment lead distribution, network hospitals, and tracked AR debt volume.</p>
              </div>
              <a href="/" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
                View Live Portal <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl border dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Inquiries</span>
                <p className="text-3xl font-black text-cyan-400 mt-2">{masterLeads.length + emergencies.length}</p>
                <span className="text-[10px] text-slate-500">Across 4 Pillars</span>
              </div>
              <div className="p-6 rounded-3xl border dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tracked Deductions/AR</span>
                <p className="text-3xl font-black text-amber-400 mt-2">₹{(totalArDebt / 100000).toFixed(2)} L</p>
                <span className="text-[10px] text-slate-500">From Auto-Recon Audits</span>
              </div>
              <div className="p-6 rounded-3xl border dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Partner Hospitals</span>
                <p className="text-3xl font-black text-teal-400 mt-2">{hospitals.length} Centers</p>
                <span className="text-[10px] text-slate-500">NCR / Haryana / Punjab</span>
              </div>
              <div className="p-6 rounded-3xl border dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Emergency Intimations</span>
                <p className="text-3xl font-black text-rose-400 mt-2">{emergencies.length} Cases</p>
                <span className="text-[10px] text-slate-500">Priority Bed/Credit Alerts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl border dark:border-slate-800 bg-white dark:bg-slate-900/60">
                <h3 className="font-semibold text-sm mb-4">Lead Breakdown by Business Pillar</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={leadDistribution} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                        {leadDistribution.map((e, idx) => <Cell key={`cell-${idx}`} fill={e.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-6 rounded-3xl border dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Pillar Quick Launch</h3>
                  <p className="text-xs text-slate-400 mb-6">Access primary administrative workflows across active divisions.</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Hospital TPA Helpdesk & Recon</span>
                      <span className="text-xs text-cyan-400 font-mono">Active (NHCX Switch)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Workforce & Bio-Pest Facility</span>
                      <span className="text-xs text-indigo-400 font-mono">Deployment Ready</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Medical Emergency Credit Line</span>
                      <span className="text-xs text-amber-400 font-mono">NBFC / Minimal Rate</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>AES-256 Cloud Vault</span>
                  <span>DPDP Act 2023 Compliant</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER INQUIRIES & LEADS */}
        {activeTab === 'master_leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Master Leads & Pipeline</h1>
                <p className="text-xs text-slate-400">All inbound requests categorized across Corporate, Staffing, Loans, and Customers.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => exportToExcel(filteredLeads, 'MediBridge_Master_Leads')} 
                  className="px-4 py-2 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Download size={14} /> Export Excel
                </button>
                <button 
                  onClick={() => exportToPDF('MediBridge Inbound Master Leads', ['Category', 'Name / Hospital', 'Phone', 'Details', 'Status'], 
                    filteredLeads.map(l => [l.category, `${l.name} (${l.hospital_or_org || 'N/A'})`, l.phone, l.details, l.status]), 
                    'MediBridge_Leads_Report'
                  )} 
                  className="px-4 py-2 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Download size={14} /> Export PDF
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Corporate', 'Staffing', 'Emergency Loan', 'Customer'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLeadFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    leadFilter === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Leads Table */}
            <div className="border rounded-2xl overflow-hidden dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Category</th>
                      <th className="p-4">Applicant / Hospital</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Requirement Specifics</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Desk Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredLeads.length > 0 ? (
                      filteredLeads.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-4 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              l.category === 'Emergency Loan' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              l.category === 'Corporate' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                              l.category === 'Staffing' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' :
                              'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {l.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-white">
                            {l.name}
                            <div className="text-[11px] font-normal text-slate-400">{l.hospital_or_org}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Phone size={12} className="text-cyan-400" />
                              <a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a>
                            </div>
                            {l.email && l.email !== 'N/A' && (
                              <div className="text-[11px] text-slate-500">{l.email}</div>
                            )}
                          </td>
                          <td className="p-4 max-w-xs text-slate-300 truncate" title={l.details}>
                            {l.details}
                          </td>
                          <td className="p-4 whitespace-nowrap text-slate-400">
                            {new Date(l.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <select
                              value={l.status || 'New'}
                              onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In-Progress">In-Progress</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          {loading ? 'Fetching inquiries...' : 'No inquiries logged yet for this category.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EMERGENCY PATIENT ALERTS */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Emergency Patient Alerts</h1>
                <p className="text-xs text-slate-400">Urgent hospital admission and pre-auth intimation requests.</p>
              </div>
              <button 
                onClick={() => exportToExcel(emergencies, 'Emergency_Intimations')} 
                className="px-4 py-2 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Download size={14} /> Export Excel (.xlsx)
              </button>
            </div>

            <div className="border rounded-2xl overflow-hidden dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Hospital</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Policy Number</th>
                    <th className="p-4">Emergency Type</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {emergencies.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-bold text-teal-400">{e.patient_name}</td>
                      <td className="p-4">{e.hospital}</td>
                      <td className="p-4">{e.phone}</td>
                      <td className="p-4 font-mono text-xs">{e.policy_number}</td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400">{e.emergency_type}</span></td>
                      <td className="p-4 text-xs text-slate-400">{new Date(e.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {emergencies.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No emergency intimations recorded yet.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUTO-RECON UPLOADED FILES */}
        {activeTab === 'audits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Auto-Reconciliation Files & Audits</h1>
                <p className="text-xs text-slate-400">Claims ledgers dropped by hospitals through the Auto-Recon engine or B2B audit form.</p>
              </div>
              <button 
                onClick={() => exportToExcel(claimAudits, 'MediBridge_Audit_Ledgers')} 
                className="px-4 py-2 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Download size={14} /> Export Audits
              </button>
            </div>

            <div className="border rounded-2xl overflow-hidden dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Hospital / Source</th>
                    <th className="p-4">Contact Person</th>
                    <th className="p-4">Est. Debt Value</th>
                    <th className="p-4">File Download / Notes</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {claimAudits.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-bold text-white">{a.hospital_name}</td>
                      <td className="p-4 text-slate-300">{a.contact_person} ({a.phone})</td>
                      <td className="p-4 font-bold text-amber-400">₹{Number(a.pending_amount || 0).toLocaleString()}</td>
                      <td className="p-4 max-w-md">
                        <div className="text-slate-300 truncate">{a.notes}</div>
                        {a.notes && a.notes.includes('http') && (
                          <a
                            href={a.notes.split('Link: ')[1] || a.notes.split('URL: ')[1] || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-bold mt-1 text-[11px]"
                          >
                            Download MIS File <ExternalLink size={12} />
                          </a>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {claimAudits.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No claims ledgers uploaded yet.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CASHLESS NETWORK DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Network Hospital Directory</h1>
                <p className="text-xs text-slate-400">Active centers displayed in the public cashless hospital search.</p>
              </div>
              <button 
                onClick={() => exportToExcel(hospitals, 'MediBridge_Cashless_Directory')} 
                className="px-4 py-2 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Download size={14} /> Download Directory (.xlsx)
              </button>
            </div>

            {/* Add Hospital Form */}
            <form onSubmit={handleAddHospital} className="p-5 border dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/60 grid grid-cols-1 md:grid-cols-5 gap-3">
              <input 
                required 
                placeholder="Hospital Name" 
                value={newHosp.name} 
                onChange={e => setNewHosp({...newHosp, name: e.target.value})} 
                className="p-3 border rounded-xl bg-white text-slate-900 border-slate-300 dark:bg-slate-950 dark:text-white dark:border-slate-700 text-xs focus:outline-none focus:border-cyan-500" 
              />
              <input 
                required 
                placeholder="City (e.g. Gurugram, Delhi)" 
                value={newHosp.city} 
                onChange={e => setNewHosp({...newHosp, city: e.target.value})} 
                className="p-3 border rounded-xl bg-white text-slate-900 border-slate-300 dark:bg-slate-950 dark:text-white dark:border-slate-700 text-xs focus:outline-none focus:border-cyan-500" 
              />
              <input 
                required 
                placeholder="State (e.g. Haryana, Delhi NCR)" 
                value={newHosp.state} 
                onChange={e => setNewHosp({...newHosp, state: e.target.value})} 
                className="p-3 border rounded-xl bg-white text-slate-900 border-slate-300 dark:bg-slate-950 dark:text-white dark:border-slate-700 text-xs focus:outline-none focus:border-cyan-500" 
              />
              <input 
                placeholder="Helpline Phone" 
                value={newHosp.phone} 
                onChange={e => setNewHosp({...newHosp, phone: e.target.value})} 
                className="p-3 border rounded-xl bg-white text-slate-900 border-slate-300 dark:bg-slate-950 dark:text-white dark:border-slate-700 text-xs focus:outline-none focus:border-cyan-500" 
              />
              <button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Plus size={15} /> Add Center
              </button>
            </form>

            <div className="border rounded-2xl overflow-hidden dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th className="p-4">Hospital Name</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Helpline</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {hospitals.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-bold">{h.name}</td>
                      <td className="p-4">{h.city}, {h.state}</td>
                      <td className="p-4">{h.contact_phone || 'Helpdesk'}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteHospital(h.id, h.name)} 
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CLAIMS TRACKER & CSV BATCH UPLOAD */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Claims Tracker Master</h1>
                <p className="text-xs text-slate-400">Bulk sync claim stages for front-end patient tracking.</p>
              </div>
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg shadow-indigo-500/20">
                <UploadCloud size={16} /> Import Master CSV / Excel
                <input type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleClaimsBatchUpload} />
              </label>
            </div>

            <div className="border rounded-2xl overflow-hidden dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th className="p-4">Claim ID</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Hospital</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Claimed</th>
                    <th className="p-4">Approved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {claims.map(c => (
                    <tr key={c.id || c.claim_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-mono font-bold text-cyan-400">{c.claim_id}</td>
                      <td className="p-4 font-semibold">{c.patient_name}</td>
                      <td className="p-4">{c.hospital_name}</td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-teal-300">{c.status}</span></td>
                      <td className="p-4">₹{c.claimed_amount}</td>
                      <td className="p-4 font-bold text-emerald-400">₹{c.approved_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {claims.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No active claims tracked. Import a CSV or Excel file above.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & PASSKEY */}
        {activeTab === 'settings' && (
          <div className="max-w-md space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Security & Settings</h1>
              <p className="text-xs text-slate-400">Update passkeys and manage institutional preferences.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 border dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/60 space-y-4">
              <div className="flex items-center gap-3 mb-2 text-cyan-400">
                <Key size={20} />
                <h3 className="font-semibold text-sm">Update Admin Passkey</h3>
              </div>
              <input 
                type="password" 
                required
                placeholder="Enter new admin password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white text-slate-900 border-slate-300 dark:bg-slate-950 dark:border-slate-700 text-xs dark:text-white focus:outline-none focus:border-cyan-500" 
              />
              <button 
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Save New Passkey
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;