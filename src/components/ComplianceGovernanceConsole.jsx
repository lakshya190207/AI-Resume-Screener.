import React, { useState } from 'react';
import { Shield, FileText, Mail, Trash2, CheckCircle2, Lock, Download, Copy, Check } from 'lucide-react';
import { INITIAL_AUDIT_LOGS, generateOutreachEmails } from '../services/complianceLogger';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { generateInterrogationQuestions } from '../services/interrogationEngine';
import { scoreCandidateResume } from '../services/scoringEngine';

export default function ComplianceGovernanceConsole({ jobReq, customWeights }) {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [selectedCandidateId, setSelectedCandidateId] = useState(SAMPLE_RESUMES[0].id);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [gdprSuccess, setGdprSuccess] = useState(false);

  const selectedSample = SAMPLE_RESUMES.find(s => s.id === selectedCandidateId) || SAMPLE_RESUMES[0];
  const evaluation = scoreCandidateResume(selectedSample.rawText, jobReq, customWeights);
  const questions = generateInterrogationQuestions(evaluation, jobReq);
  const emailTemplate = generateOutreachEmails(selectedSample.name, evaluation.category, jobReq.title, questions);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${emailTemplate.subject}\n\n${emailTemplate.body}`);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleExecuteGdprPurge = () => {
    setLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Data Privacy Officer (GDPR Bot)',
        action: 'GDPR_PURGE_EXECUTED',
        details: `Purged candidate record & demographic keys for candidate reference ${selectedSample.id}.`,
        category: 'Data Governance'
      },
      ...prev
    ]);
    setGdprSuccess(true);
    setTimeout(() => setGdprSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Governance, Security & Candidate Communication</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Compliance & Operational Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable security audit trails, automated candidate outreach templates, and GDPR "Right to be Forgotten" governance.
          </p>
        </div>

        {/* Direct PDF Report Link */}
        <a
          href="/AI_Resume_Screening_Agent_Report.pdf"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-sky-400 font-bold text-xs rounded-md border border-slate-800 transition-colors flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Download Executive PDF Report</span>
        </a>
      </div>

      {gdprSuccess && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>GDPR / CCPA Data Purge Executed: Candidate record permanently purged and logged to audit trail.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Candidate Outreach Communication Hub */}
        <div className="lg:col-span-6 panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Automated Candidate Communication Templates</span>
              </h3>
              <p className="text-[11px] text-slate-400">Contextual interview invitations & respectful rejections</p>
            </div>

            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              {SAMPLE_RESUMES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name.split('/')[0].trim()} ({scoreCandidateResume(s.rawText, jobReq, customWeights).category})
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-md bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">Email Template Type:</span>
              <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                emailTemplate.type === 'INVITATION' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {emailTemplate.type}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Subject:</span>
              <div className="font-semibold text-slate-100 bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                {emailTemplate.subject}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Message Body:</span>
              <div className="bg-slate-900 p-3 rounded border border-slate-800 text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                {emailTemplate.body}
              </div>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                onClick={handleCopyEmail}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied to Clipboard' : 'Copy Email Template'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Security Audit Log & GDPR Governance */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Security Audit Trail Panel */}
          <div className="panel p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Lock className="w-4 h-4 text-sky-400" />
              <span>Immutable System Audit Log</span>
            </h3>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-md bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-400">{log.details}</p>
                  <div className="text-[10px] text-slate-500 font-mono">Actor: {log.actor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GDPR Right to be Forgotten Panel */}
          <div className="panel p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>GDPR / CCPA Candidate Data Governance</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate candidate "Right to be Forgotten" requests. Permanently purges candidate resume text and decouples demographic vault records.
            </p>

            <button
              onClick={handleExecuteGdprPurge}
              className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs rounded border border-rose-500/30 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Execute Candidate Data Deletion (GDPR Compliance)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
