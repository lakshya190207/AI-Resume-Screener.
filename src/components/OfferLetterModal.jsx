import React, { useState } from 'react';
import { FileText, Copy, Download, Check, X, Award, DollarSign, Calendar, Sparkles } from 'lucide-react';

export default function OfferLetterModal({ isOpen, onClose, candidate, jobReq }) {
  if (!isOpen || !candidate) return null;

  const [salary, setSalary] = useState('$165,000 / year');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [equity, setEquity] = useState('25,000 RSUs (4-year vesting schedule)');
  const [managerName, setManagerName] = useState('Director of Engineering');
  const [copied, setCopied] = useState(false);

  const candidateName = candidate.name ? candidate.name.split('/')[0].trim() : (candidate.fileName || 'Candidate');
  const jobTitle = jobReq?.title || 'Senior Software Engineer';

  const offerLetterText = `CONFIDENTIAL & PROPRIETARY JOB OFFER LETTER

Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

Dear ${candidateName},

On behalf of TalentMatrix Enterprise Systems, we are thrilled to offer you the position of ${jobTitle}. Based on your exceptional background, technical competency, and outstanding performance throughout our recruitment evaluation, we believe your skills will be instrumental to our team's continued growth and success.

OFFER DETAILS & COMPENSATION:
--------------------------------------------------------------------------------
Position Title:    ${jobTitle}
Department:        Engineering & Product Development
Reporting Manager: ${managerName}
Target Start Date: ${startDate}

COMPENSATION PACKAGE:
• Base Salary:     ${salary}, paid on a bi-weekly schedule.
• Equity Grant:    ${equity}, subject to Board approval and 1-year cliff vesting.
• Performance:     Eligible for annual discretionary bonus up to 15% of base salary.
• Benefits:        Full health, dental, vision insurance, 401(k) matching, and flexible PTO.

CONFIDENTIALITY & AT-WILL EMPLOYMENT:
This offer is contingent upon successful completion of background verification. Employment with TalentMatrix Enterprise Systems is at-will.

ACCEPTANCE OF OFFER:
To accept this offer, please sign and return a copy of this letter by 5:00 PM EST on ${new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

We look forward to welcoming you to the team!

Sincerely,

Talent Matrix Talent Acquisition Team
TalentMatrix Enterprise Systems Inc.
--------------------------------------------------------------------------------
ACCEPTED AND AGREED:

Candidate Signature: ___________________________   Date: ______________`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(offerLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Job Offer Letter - ${candidateName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            h2 { color: #0369a1; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
            .details { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 20px 0; font-family: monospace; font-size: 13px; }
            .footer { margin-top: 50px; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: inherit;">${offerLetterText}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#111622] border border-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-in">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <span>Job Offer Letter Generator</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Generate, customize & copy official job offer for {candidateName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          
          {/* Compensation Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Base Salary</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Target Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Equity / Stock</label>
              <input
                type="text"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Reporting Manager</label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Letter Preview Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Formatted Offer Letter Preview</span>
              <span>Candidate Match: <strong className="text-emerald-400">{candidate.scores?.overall || 88}% Score</strong></span>
            </div>

            <textarea
              readOnly
              rows={13}
              value={offerLetterText}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-3.5 text-xs text-slate-300 font-mono leading-relaxed focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Ready to send to selected candidate</span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 font-bold text-xs rounded border border-slate-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Offer Copied!' : 'Copy Letter Text'}</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
