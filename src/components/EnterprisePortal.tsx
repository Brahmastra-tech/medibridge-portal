// src/components/EnterprisePortal.tsx
import React, { useState } from 'react';
import { 
  Building2, Users, FileSpreadsheet, Download, Upload, ShieldCheck, 
  Sparkles, KeyRound, CheckCircle2, AlertTriangle, ArrowLeft, Plus, 
  FileText, IndianRupee, Sliders, Database, Search, Check, RefreshCw
} from 'lucide-react';
import { INITIAL_ROHINI_REGISTRY, RohiniRecord, HospitalUser, ReconUploadRow, AdminLead } from '../lib/hospitalStore';

interface Props {
  viewMode: 'hospital-portal' | 'admin-panel';
  onExit: () => void;
}

export const EnterprisePortal: React.FC<Props> = ({ viewMode, onExit }) => {
  // Master Databases
  const [registry, setRegistry] = useState<Record<string, RohiniRecord>>(INITIAL_ROHINI_REGISTRY);
  
  const [hospitalUsers, setHospitalUsers] = useState<HospitalUser[]>([
    {
      userId: 'MB-2101-441',
      rohiniId: 'ROHINI-892101',
      hospitalName: 'Apollo Multispeciality Hospital',
      name: 'Dr. Rajiv Malhotra',
      role: 'Hospital Admin',
      email: 'billing@apollo.org',
      mobile: '+91 98110 44210',
      createdAt: '12 Sep 2026'
    },
    {
      userId: 'MB-2101-892',
      rohiniId: 'ROHINI-892101',
      hospitalName: 'Apollo Multispeciality Hospital',
      name: 'Prakash Sharma',
      role: 'Finance / Billing',
      email: 'prakash.billing@apollo.org',
      mobile: '+91 98711 00293',
      createdAt: '13 Sep 2026'
    }
  ]);

  const [adminLeads, setAdminLeads] = useState<AdminLead[]>([
    { id: 'LD-9081', rohiniId: 'ROHINI-892101', hospitalName: 'Apollo Multispeciality', service: 'Revenue Cycle Desk', contactPerson: 'Rajiv Malhotra', contactNo: '+91 98110 44210', createdAt: '13 Sep 2026', status: 'In Review' },
    { id: 'LD-9082', rohiniId: 'ROHINI-441208', hospitalName: 'Max Super Speciality', service: 'NABH Accreditation Readiness', contactPerson: 'Suresh Singhania', contactNo: '+91 98710 99882', createdAt: '13 Sep 2026', status: 'New' }
  ]);

  // Reconciliation File State
  const [reconData, setReconData] = useState<ReconUploadRow[]>([
    { id: '1', claimId: 'CLM-APL-01', patientName: 'Ramesh Gupta', payer: 'Star Health Insurance', billedAmount: 145000, settledAmount: 135000, varianceAmount: 10000, utr: 'HDFC90812901', status: 'Variance', deductionReason: 'Room rent cap deduction vs NABH tariff' },
    { id: '2', claimId: 'CLM-APL-02', patientName: 'Anita Roy', payer: 'Medi Assist TPA', billedAmount: 220000, settledAmount: 220000, varianceAmount: 0, utr: 'AXIS11029381', status: 'Matched' },
    { id: '3', claimId: 'CLM-APL-03', patientName: 'Mohd. Siraj', payer: 'Care Health', billedAmount: 85000, settledAmount: 85000, varianceAmount: 0, utr: 'ICIC88192039', status: 'Matched' },
    { id: '4', claimId: 'CLM-APL-04', patientName: 'Sunita Devi', payer: 'Vidal Health TPA', billedAmount: 180000, settledAmount: 155000, varianceAmount: 25000, utr: 'KKBK77102938', status: 'Variance', deductionReason: 'Unapproved ICU consumables' }
  ]);

  // Hospital Portal Active Tab
  const [hospitalTab, setHospitalTab] = useState<'dashboard' | 'reconciliation' | 'users' | 'reports' | 'ai-dashboard'>('dashboard');

  // Admin Active Tab
  const [adminTab, setAdminTab] = useState<'registry-upload' | 'users' | 'leads'>('registry-upload');

  // New Sub-User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Finance / Billing' | 'Operations' | 'HR' | 'Viewer'>('Finance / Billing');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');

  // Admin Batch Registry Input
  const [batchRohiniText, setBatchRohiniText] = useState('');
  const [batchMsg, setBatchMsg] = useState('');

  // AI Dashboard Customizer
  const [aiWidgets, setAiWidgets] = useState({
    leakageRadar: true,
    tpaPayerBreakdown: true,
    denialPredictor: true,
    cashflowSpeedometer: true
  });

  // Calculate totals
  const totalBilled = reconData.reduce((acc, r) => acc + r.billedAmount, 0);
  const totalSettled = reconData.reduce((acc, r) => acc + r.settledAmount, 0);
  const totalVariance = reconData.reduce((acc, r) => acc + r.varianceAmount, 0);

  // Function to create Sub User
  const handleAddSubUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPhone) return;

    const created: HospitalUser = {
      userId: `MB-2101-${Math.floor(100 + Math.random() * 900)}`,
      rohiniId: 'ROHINI-892101',
      hospitalName: 'Apollo Multispeciality Hospital',
      name: newUserName,
      role: newUserRole,
      email: newUserEmail,
      mobile: newUserPhone,
      createdAt: 'Just now'
    };

    setHospitalUsers([...hospitalUsers, created]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    alert(`Sub-User Created! User ID: ${created.userId}`);
  };

  // CSV Export helper
  const downloadCSV = (type: 'recon' | 'tpa-outstanding') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'recon') {
      csvContent += "Claim ID,Patient Name,Payer,Billed,Settled,Variance,UTR,Status,Deduction Reason\n";
      reconData.forEach(r => {
        csvContent += `${r.claimId},${r.patientName},${r.payer},${r.billedAmount},${r.settledAmount},${r.varianceAmount},${r.utr},${r.status},"${r.deductionReason || 'N/A'}"\n`;
      });
    } else {
      csvContent += "Payer / TPA,Total Claims,Billed Amount,Realized,Outstanding Amount,Avg Days\n";
      csvContent += "Star Health Insurance,14,1450000,1220000,230000,22\n";
      csvContent += "Medi Assist TPA,28,3200000,2850000,350000,18\n";
      csvContent += "Care Health Insurance,9,890000,890000,0,14\n";
      csvContent += "Vidal Health TPA,12,1800000,1420000,380000,34\n";
      csvContent += "GRAND TOTAL,63,7340000,6380000,960000,22\n";
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `medibridge_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Mock File Upload for Reconciliation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      const newMockRow: ReconUploadRow = {
        id: (reconData.length + 1).toString(),
        claimId: `CLM-UPL-0${reconData.length + 1}`,
        patientName: 'Vipin Mehra',
        payer: 'HDFC ERGO General',
        billedAmount: 310000,
        settledAmount: 280000,
        varianceAmount: 30000,
        utr: 'HDFC' + Math.floor(10000000 + Math.random() * 90000000),
        status: 'Variance',
        deductionReason: 'Disputed co-pay deduction under file: ' + fileName
      };
      setReconData([newMockRow, ...reconData]);
      alert(`File "${fileName}" ingested & auto-reconciled with bank UTR credit!`);
    }
  };

  // Admin Batch Rohini Upload parser
  const handleBatchRegistryUpload = () => {
    if (!batchRohiniText.trim()) return;
    const lines = batchRohiniText.trim().split('\n');
    const updated = { ...registry };
    let count = 0;

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const id = parts[0].toUpperCase();
        updated[id] = {
          id: id,
          name: parts[1] || 'Hospital Unit',
          address: parts[2] || 'Medical Enclave',
          city: parts[3] || 'New Delhi',
          state: parts[4] || 'Delhi',
          contactPerson: parts[5] || 'Hospital Desk',
          contactNo: parts[6] || '+91 98000 00000',
          email: parts[7] || 'admin@hospital.org'
        };
        count++;
      }
    });

    setRegistry(updated);
    setBatchMsg(`Successfully added/updated ${count} hospitals to master Rohini registry!`);
    setBatchRohiniText('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col antialiased">
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-[#070d1a] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={onExit} 
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold px-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Site
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">
              {viewMode === 'hospital-portal' ? 'Apollo Multispeciality Hospital' : 'MediBridge Master Admin Panel'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> {viewMode === 'hospital-portal' ? 'ROHINI-892101' : 'Super Admin Mode'}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {viewMode === 'hospital-portal' ? (
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">User: MB-2101-441 (Admin)</span>
          ) : (
            <span className="text-xs text-cyan-400 font-mono">Registry: {Object.keys(registry).length} Hospitals Loaded</span>
          )}
        </div>
      </header>

      {/* ================= HOSPITAL PORTAL ================= */}
      {viewMode === 'hospital-portal' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
          
          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-800">
            <button
              onClick={() => setHospitalTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${hospitalTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Executive Cockpit
            </button>
            <button
              onClick={() => setHospitalTab('reconciliation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${hospitalTab === 'reconciliation' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Upload & Reconcile Claims
            </button>
            <button
              onClick={() => setHospitalTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${hospitalTab === 'users' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Sub-Users & Permissions
            </button>
            <button
              onClick={() => setHospitalTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${hospitalTab === 'reports' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Download Financial Reports
            </button>
            <button
              onClick={() => setHospitalTab('ai-dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${hospitalTab === 'ai-dashboard' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-purple-400 hover:text-white'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Smart Dashboard
            </button>
          </div>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {hospitalTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Claims Realised</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-2">₹{(totalSettled / 100000).toFixed(2)} L</p>
                  <p className="text-[11px] text-slate-500 mt-1">100% UTR Bank Synced</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Payer Variance (Deductions)</span>
                  <p className="text-2xl font-bold text-amber-400 mt-2">₹{(totalVariance / 1000).toFixed(1)} K</p>
                  <p className="text-[11px] text-amber-500/80 mt-1">Pending Dispute Recovery</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">TPA Overdue AR</span>
                  <p className="text-2xl font-bold text-rose-400 mt-2">₹9.60 L</p>
                  <p className="text-[11px] text-rose-500/80 mt-1">Ageing &gt; 30 Days</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Authorized Users</span>
                  <p className="text-2xl font-bold text-cyan-400 mt-2">{hospitalUsers.length} Active</p>
                  <p className="text-[11px] text-cyan-500/80 mt-1">Rohini Role-Based Access</p>
                </div>
              </div>

              {/* Quick File Action Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-[#070e1c] border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Daily Reconciliation Sync Pending?</h4>
                  <p className="text-xs text-slate-400 mt-1">Upload today's bank settlement statement (CSV/Excel) to automatically detect shortage deductions.</p>
                </div>
                <button 
                  onClick={() => setHospitalTab('reconciliation')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-600/30"
                >
                  <Upload className="w-4 h-4" /> Go to File Upload
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD & RECONCILE CLAIMS */}
          {hospitalTab === 'reconciliation' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-1">Upload Reconciliation File</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Upload raw hospital billing or TPA settlement files. The engine automatically matches claim numbers, UTRs, and approved amounts.
                </p>

                <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-8 text-center transition-all bg-slate-950/40">
                  <FileSpreadsheet className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-200">Select Bank / TPA CSV or Excel file</p>
                  <p className="text-[11px] text-slate-500 mt-1">Supported columns: Claim ID, Patient Name, Payer, Billed, Settled, UTR</p>
                  
                  <label className="mt-4 inline-block px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-md">
                    <span>Browse & Upload File</span>
                    <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Current Reconciled Table */}
              <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white">Live Reconciled Claims Registry</h4>
                  <button onClick={() => downloadCSV('recon')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Export Reconciled CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">CLAIM ID</th>
                        <th className="pb-3 font-semibold">PATIENT</th>
                        <th className="pb-3 font-semibold">PAYER</th>
                        <th className="pb-3 font-semibold">BILLED</th>
                        <th className="pb-3 font-semibold">SETTLED</th>
                        <th className="pb-3 font-semibold">VARIANCE</th>
                        <th className="pb-3 font-semibold">UTR</th>
                        <th className="pb-3 font-semibold text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {reconData.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-900/40">
                          <td className="py-3 font-mono font-bold text-white">{row.claimId}</td>
                          <td className="py-3 text-slate-300">{row.patientName}</td>
                          <td className="py-3 text-slate-400">{row.payer}</td>
                          <td className="py-3 font-mono">₹{row.billedAmount.toLocaleString('en-IN')}</td>
                          <td className="py-3 font-mono text-emerald-400 font-bold">₹{row.settledAmount.toLocaleString('en-IN')}</td>
                          <td className="py-3 font-mono text-amber-400">
                            {row.varianceAmount > 0 ? `₹${row.varianceAmount.toLocaleString('en-IN')}` : '₹0'}
                          </td>
                          <td className="py-3 font-mono text-[11px] text-slate-500">{row.utr}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === 'Matched' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUB-USERS & PERMISSIONS */}
          {hospitalTab === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Create Sub-User */}
              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-1">Create Hospital Sub-User</h3>
                <p className="text-xs text-slate-400 mb-4">Grant role-based access for billing heads, HR, or finance teams under your Rohini account.</p>

                <form onSubmit={handleAddSubUser} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">FULL NAME *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Chandra" 
                      value={newUserName} 
                      onChange={(e) => setNewUserName(e.target.value)} 
                      required 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">ASSIGNED DEPARTMENT ROLE</label>
                    <select 
                      value={newUserRole} 
                      onChange={(e) => setNewUserRole(e.target.value as any)} 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Finance / Billing">Finance / Billing (RCM & Recon)</option>
                      <option value="Operations">Operations (Empanelment & Pest AMC)</option>
                      <option value="HR">HR (Workforce Requisitions)</option>
                      <option value="Viewer">Viewer (Reports Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">OFFICIAL EMAIL *</label>
                    <input 
                      type="email" 
                      placeholder="ramesh@apollo.org" 
                      value={newUserEmail} 
                      onChange={(e) => setNewUserEmail(e.target.value)} 
                      required 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">MOBILE NUMBER *</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={newUserPhone} 
                      onChange={(e) => setNewUserPhone(e.target.value)} 
                      required 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white text-xs mt-2 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Provision Sub-User Account
                  </button>
                </form>
              </div>

              {/* Existing Sub-Users Table */}
              <div className="lg:col-span-7 bg-[#070e1c] border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-1">Provisioned Hospital Team</h3>
                <p className="text-xs text-slate-400 mb-4">All users operate under Master Rohini ID: <span className="text-emerald-400 font-mono font-bold">ROHINI-892101</span></p>

                <div className="space-y-3">
                  {hospitalUsers.map((u) => (
                    <div key={u.userId} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{u.name}</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-semibold">{u.role}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-1 font-mono">
                          ID: <span className="text-slate-200">{u.userId}</span> • {u.email} • {u.mobile}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{u.createdAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOWNLOAD FINANCIAL REPORTS */}
          {hospitalTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Report 1: Reconciliation Report */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">Full Claim Reconciliation Audit</h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Detailed line-item reconciliation of every submitted claim against bank credits, showing variance reasons and UTR reference tags.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{reconData.length} records processed</span>
                    <button 
                      onClick={() => downloadCSV('recon')} 
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download CSV Report
                    </button>
                  </div>
                </div>

                {/* Report 2: Payer-wise AR Outstanding */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">TPA & Payer-Wise Outstanding Report</h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Grand total and payer-wise summary across Star Health, Care Health, Medi Assist, Vidal Health with average DSO realization days.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-bold">Total Overdue: ₹9.60 L</span>
                    <button 
                      onClick={() => downloadCSV('tpa-outstanding')} 
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-slate-950 text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Summary CSV
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: AI SMART DASHBOARD */}
          {hospitalTab === 'ai-dashboard' && (
            <div className="space-y-6">
              
              {/* Customizer Toggles */}
              <div className="p-5 rounded-3xl bg-purple-950/20 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white">AI Telemetry Customizer: Toggle Active Analytics</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={aiWidgets.leakageRadar} 
                      onChange={(e) => setAiWidgets({ ...aiWidgets, leakageRadar: e.target.checked })} 
                      className="rounded accent-purple-500" 
                    />
                    <span>Leakage Radar</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={aiWidgets.tpaPayerBreakdown} 
                      onChange={(e) => setAiWidgets({ ...aiWidgets, tpaPayerBreakdown: e.target.checked })} 
                      className="rounded accent-purple-500" 
                    />
                    <span>TPA Breakdown</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={aiWidgets.denialPredictor} 
                      onChange={(e) => setAiWidgets({ ...aiWidgets, denialPredictor: e.target.checked })} 
                      className="rounded accent-purple-500" 
                    />
                    <span>Denial Predictor</span>
                  </label>
                </div>
              </div>

              {/* Dynamic AI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiWidgets.leakageRadar && (
                  <div className="p-6 rounded-3xl bg-[#070e1c] border border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-purple-400 font-bold">AI TELEMETRY</span>
                    <h4 className="text-base font-bold text-white mt-1">Revenue Leakage Radar</h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Predicted avoidable deductions this month: <strong className="text-rose-400">₹42,000</strong> primarily in surgical consumables and ICU room-rent slabs.
                    </p>
                  </div>
                )}

                {aiWidgets.tpaPayerBreakdown && (
                  <div className="p-6 rounded-3xl bg-[#070e1c] border border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold">SETTLEMENT VELOCITY</span>
                    <h4 className="text-base font-bold text-white mt-1">Payer Payout Speed</h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Fastest: <strong>Care Health (14 Days)</strong><br />
                      Lagging: <strong className="text-amber-400">Vidal Health TPA (34 Days)</strong>. Escalation auto-triggered.
                    </p>
                  </div>
                )}

                {aiWidgets.denialPredictor && (
                  <div className="p-6 rounded-3xl bg-[#070e1c] border border-slate-800">
                    <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">PRE-AUDIT SCORING</span>
                    <h4 className="text-base font-bold text-white mt-1">Claim Denial Shield</h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Accuracy score on outgoing claims is <strong className="text-emerald-400">96.8%</strong>. AI has auto-corrected 14 billing codes prior to TPA portal upload.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ================= MEDIBRIDGE ADMIN PANEL ================= */}
      {viewMode === 'admin-panel' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
          
          {/* Admin Navigation */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-800">
            <button
              onClick={() => setAdminTab('registry-upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'registry-upload' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Master Rohini Registry Upload
            </button>
            <button
              onClick={() => setAdminTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'users' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Hospital User Directory ({hospitalUsers.length})
            </button>
            <button
              onClick={() => setAdminTab('leads')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'leads' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              Customer Leads & Queries ({adminLeads.length})
            </button>
          </div>

          {/* ADMIN TAB 1: ROHINI REGISTRY UPLOAD */}
          {adminTab === 'registry-upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-1">Batch Upload Rohini Verified List</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Paste comma-separated hospital records (CSV format):<br />
                  <code className="text-cyan-400 text-[10px]">RohiniID, HospitalName, Address, City, State, ContactPerson, Phone, Email</code>
                </p>

                {batchMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {batchMsg}
                  </div>
                )}

                <textarea
                  rows={6}
                  value={batchRohiniText}
                  onChange={(e) => setBatchRohiniText(e.target.value)}
                  placeholder="ROHINI-901122, City Heart Hospital, Civil Lines, Jaipur, Rajasthan, Dr. Singhal, +91 9829011223, info@cityheart.org"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />

                <button
                  onClick={handleBatchRegistryUpload}
                  className="mt-3 w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white text-xs flex items-center justify-center gap-1.5"
                >
                  <Database className="w-4 h-4" /> Synchronize Master Registry
                </button>
              </div>

              <div className="lg:col-span-6 bg-[#070e1c] border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-1">Active Verified Master Directory</h3>
                <p className="text-xs text-slate-400 mb-4">{Object.keys(registry).length} institutions validated for auto-fill throughout MediBridge forms.</p>

                <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
                  {Object.values(registry).map((h) => (
                    <div key={h.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-cyan-400">{h.id}</span>
                        <span className="text-[10px] text-slate-400">{h.city}, {h.state}</span>
                      </div>
                      <div className="font-bold text-white mt-0.5">{h.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1">Contact: {h.contactPerson} ({h.contactNo})</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TAB 2: USER DIRECTORY */}
          {adminTab === 'users' && (
            <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-1">Provisioned Hospital User Credentials Table</h3>
              <p className="text-xs text-slate-400 mb-4">Internal directory of all hospital administrators and sub-users.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">USER ID</th>
                      <th className="pb-3">ROHINI ID</th>
                      <th className="pb-3">HOSPITAL NAME</th>
                      <th className="pb-3">AUTHORIZED USER</th>
                      <th className="pb-3">ROLE</th>
                      <th className="pb-3">CONTACT</th>
                      <th className="pb-3 text-right">CREATED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {hospitalUsers.map((user) => (
                      <tr key={user.userId} className="hover:bg-slate-900/40">
                        <td className="py-3 font-mono font-bold text-cyan-400">{user.userId}</td>
                        <td className="py-3 font-mono text-emerald-400">{user.rohiniId}</td>
                        <td className="py-3 font-medium text-white">{user.hospitalName}</td>
                        <td className="py-3 text-slate-300">{user.name}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">{user.role}</span></td>
                        <td className="py-3 text-slate-400">{user.mobile}</td>
                        <td className="py-3 text-right text-slate-500">{user.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADMIN TAB 3: CUSTOMER INQUIRIES & LEADS */}
          {adminTab === 'leads' && (
            <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-1">Hospital Inquiries & Growth Leads Table</h3>
              <p className="text-xs text-slate-400 mb-4">All inquiries dispatched from Empanelment, RCM, or Compliance modals.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">LEAD ID</th>
                      <th className="pb-3">ROHINI ID</th>
                      <th className="pb-3">HOSPITAL</th>
                      <th className="pb-3">REQUESTED MODULE</th>
                      <th className="pb-3">CONTACT PERSON</th>
                      <th className="pb-3">PHONE</th>
                      <th className="pb-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {adminLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-900/40">
                        <td className="py-3 font-mono font-bold text-white">{lead.id}</td>
                        <td className="py-3 font-mono text-emerald-400">{lead.rohiniId}</td>
                        <td className="py-3 font-medium text-white">{lead.hospitalName}</td>
                        <td className="py-3 text-cyan-400 font-medium">{lead.service}</td>
                        <td className="py-3 text-slate-300">{lead.contactPerson}</td>
                        <td className="py-3 text-slate-400">{lead.contactNo}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400">
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};