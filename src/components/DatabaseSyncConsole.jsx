import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle2, Play, Pause, Server, Lock, ArrowUpRight, Filter, AlertCircle } from 'lucide-react';
import { COMPANY_DATABASE_RECORDS, DATABASE_CONNECTOR_CONFIGS, executeDatabaseSyncPipeline } from '../services/databaseSyncEngine';

export default function DatabaseSyncConsole({ jobReq, customWeights }) {
  const [dbRecords, setDbRecords] = useState(COMPANY_DATABASE_RECORDS);
  const [activeConnector, setActiveConnector] = useState('postgres');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [syncLogs, setSyncLogs] = useState([]);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const pendingCount = dbRecords.filter(r => r.status === 'PENDING_SCREENING').length;
  const screenedCount = dbRecords.filter(r => r.status === 'SCREENED').length;

  const handleManualSync = () => {
    const result = executeDatabaseSyncPipeline(dbRecords, jobReq, customWeights);
    setDbRecords(result.updatedRecords);
    setSyncLogs(prev => [...result.syncLogs, ...prev]);
    setLastSyncedAt(new Date().toLocaleTimeString());
  };

  // Auto-sync interval simulation
  useEffect(() => {
    let interval = null;
    if (autoSyncEnabled && pendingCount > 0) {
      interval = setInterval(() => {
        handleManualSync();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoSyncEnabled, pendingCount, dbRecords, jobReq, customWeights]);

  const handleInsertNewDbApplicant = () => {
    const newRecord = {
      candidate_id: `db-cand-${Math.floor(100 + Math.random() * 900)}`,
      applicant_name: 'Incoming Applicant',
      email: 'applicant.new@company-db.com',
      applied_role_id: jobReq.id,
      application_date: new Date().toISOString(),
      status: 'PENDING_SCREENING',
      raw_resume_text: `INCOMING APPLICANT
Email: applicant.new@company-db.com | Phone: 555-019-2834 | San Francisco, CA
Graduated: 2020 | Female | She/Her

SUMMARY
Senior AI Infrastructure Engineer with 6 years experience in Python, PyTorch, System Architecture, Docker, Kubernetes, and TensorRT.

EXPERIENCE
Staff AI Engineer | TechScale Inc (2021 – Present)
- Architected GPU distributed training pipelines with PyTorch and Docker.
- Optimized REST API inference serving layers.`
    };
    setDbRecords(prev => [newRecord, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Automated Company Database & ATS Sync Pipeline</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Direct Database Ingestion & Automatic Screening</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connects to company database (PostgreSQL, ATS REST Webhooks), ingests unscreened applicants, runs 5-phase screening, and writes back evaluation metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleInsertNewDbApplicant}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded border border-slate-800 transition-colors cursor-pointer"
          >
            + Simulate Incoming DB Applicant
          </button>

          <button
            onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
            className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors flex items-center space-x-1.5 cursor-pointer ${
              autoSyncEnabled 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 animate-pulse' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {autoSyncEnabled ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
            <span>{autoSyncEnabled ? 'Auto-Sync Service Active' : 'Start Auto-Sync Daemon'}</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={pendingCount === 0}
            className={`px-4 py-1.5 text-xs font-bold text-white rounded transition-colors flex items-center space-x-1.5 cursor-pointer ${
              pendingCount > 0
                ? 'bg-sky-600 hover:bg-sky-500'
                : 'bg-slate-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Database Now ({pendingCount} Pending)</span>
          </button>
        </div>
      </div>

      {/* Database Connection Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DATABASE_CONNECTOR_CONFIGS.map(conn => {
          const isSelected = activeConnector === conn.id;
          return (
            <div
              key={conn.id}
              onClick={() => setActiveConnector(conn.id)}
              className={`panel p-4 cursor-pointer transition-colors space-y-2 ${
                isSelected ? 'border-sky-500 bg-slate-900/90' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5 text-sky-400" />
                  <span>{conn.name}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                  {conn.status}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">{conn.host}</p>
            </div>
          );
        })}
      </div>

      {/* Database Applicants Table & Live Sync Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Live Company Database Records */}
        <div className="lg:col-span-7 panel space-y-3">
          <div className="panel-header flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Company Database Table: <span className="text-sky-400 font-mono">public.applicant_resumes</span>
            </h3>
            <div className="flex space-x-3 text-[11px]">
              <span className="text-amber-400 font-medium">Pending: {pendingCount}</span>
              <span className="text-emerald-400 font-medium">Screened: {screenedCount}</span>
            </div>
          </div>

          <div className="p-4 pt-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2">Candidate ID</th>
                  <th className="py-2">Name & Email</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {dbRecords.map((r) => (
                  <tr key={r.candidate_id} className="hover:bg-slate-900/50">
                    <td className="py-2.5 text-slate-300">{r.candidate_id}</td>
                    <td className="py-2.5">
                      <div className="font-sans font-bold text-slate-100">{r.applicant_name}</div>
                      <div className="text-[10px] text-slate-500">{r.email}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded font-sans text-[10px] font-bold ${
                        r.status === 'SCREENED' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-slate-200">
                      {r.evaluation_score !== undefined ? `${r.evaluation_score}%` : '—'}
                    </td>
                    <td className="py-2.5 font-sans font-bold">
                      {r.category ? (
                        <span className={`text-[10px] ${
                          r.category === 'Top Tier' ? 'text-emerald-400' : r.category === 'Qualified' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {r.category}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Database Synchronization Logs */}
        <div className="lg:col-span-5 panel p-5 space-y-3">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Automatic Database Writeback Logs
            </h3>
            {lastSyncedAt && (
              <span className="text-[10px] text-slate-500 font-mono">Last Sync: {lastSyncedAt}</span>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {syncLogs.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 italic">
                Click "Sync Database Now" or start Auto-Sync Daemon to ingest and process pending DB records.
              </div>
            ) : (
              syncLogs.map((log) => (
                <div key={log.id} className="p-3 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{log.applicantName} ({log.candidateId})</span>
                    <span className="text-sky-400 font-mono font-bold">{log.score}% Score</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
