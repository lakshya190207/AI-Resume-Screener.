import React from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  FileText, 
  History, 
  UserCheck, 
  AlertTriangle,
  LayoutDashboard,
  Layers,
  Columns,
  Shield,
  Plus,
  Database,
  Zap,
  Rocket
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  jobReqs, 
  activeJobId, 
  setActiveJobId, 
  fairnessStatus,
  onOpenCreateJobModal
}) {
  const isAlert = fairnessStatus?.status === 'DISPARITY_ALERT';

  return (
    <header className="bg-[#111622] border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-14 border-b border-slate-800/60">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-100 tracking-tight">TalentMatrix</span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-xs text-slate-400 font-medium">AI Resume Screener</span>
            </div>
          </div>

          {/* Role Requisition & Audit Status */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCreateJobModal}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-400 text-xs font-semibold rounded border border-slate-800 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Role</span>
            </button>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md">
              <label className="text-xs text-slate-400 font-medium">Requisition:</label>
              <select
                value={activeJobId}
                onChange={(e) => setActiveJobId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                {jobReqs.map(job => (
                  <option key={job.id} value={job.id} className="bg-slate-900 text-slate-200">
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Fairness Health Status */}
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
              isAlert 
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}>
              {isAlert ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isAlert ? 'Disparity Alert' : 'Fairness: Healthy'}</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 py-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'batch_screener', label: '1-Click Batch Screener', icon: Zap },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'screener', label: 'Single Resume Lab', icon: FileText },
            { id: 'database_sync', label: 'Company DB Auto-Sync', icon: Database },
            { id: 'comparison', label: 'Comparison Matrix', icon: Columns },
            { id: 'baseline', label: 'Job Baseline Editor', icon: Sliders },
            { id: 'historical', label: 'Historical Trajectory', icon: History },
            { id: 'hitl', label: 'Recruiter Audit', icon: UserCheck },
            { id: 'fairness', label: 'Fairness Audit', icon: ShieldCheck },
            { id: 'compliance', label: 'Compliance & Governance', icon: Shield },
            { id: 'preflight', label: 'Production Pre-Flight', icon: Rocket }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-sky-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
