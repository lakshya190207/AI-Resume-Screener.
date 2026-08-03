import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Download, 
  Sparkles, 
  Loader2, 
  FileText, 
  Ban, 
  Trash2, 
  Check,
  FileCheck
} from 'lucide-react';
import { parseMultipleUploadedResumeFiles } from '../services/fileParser';

export default function EasyBatchScreener({ 
  jobReq, 
  customWeights, 
  evaluatedCandidates, 
  onAddCandidate,
  onRejectCandidate,
  onDeleteCandidate,
  onGenerateOffer
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [autoPilot, setAutoPilot] = useState(true);
  const [exportedCsv, setExportedCsv] = useState(false);
  const fileInputRef = useRef(null);

  const displayList = evaluatedCandidates || [];

  const handleProcessFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const parsedItems = await parseMultipleUploadedResumeFiles(files);

      parsedItems.forEach(item => {
        if (item.status === 'SUCCESS' && item.text) {
          const newCand = {
            id: `cand-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: item.fileName.replace(/\.[^/.]+$/, ""),
            fileName: item.fileName,
            rawText: item.text,
            label: 'Uploaded Resume'
          };
          if (onAddCandidate) {
            onAddCandidate(newCand);
          }
        }
      });
    } catch (err) {
      console.error('Error processing batch resumes:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Rank', 'Candidate Reference', 'File Name', 'Tier Category', 'Weighted Score', 'Must-Haves Met', 'Missing Must-Haves', 'Years Experience', 'Education'];
    const rows = displayList.map((item, idx) => [
      idx + 1,
      `"${item.name}"`,
      `"${item.fileName || item.id}"`,
      `"${item.category || item.evaluation?.category}"`,
      `${item.scores?.overall ?? item.evaluation?.scores?.overall}%`,
      `"${(item.skillMatch?.matchedMustHaves || item.evaluation?.skillMatch?.matchedMustHaves || []).join(', ')}"`,
      `"${(item.skillMatch?.missingMustHaves || item.evaluation?.skillMatch?.missingMustHaves || []).join(', ')}"`,
      `"${item.candidateFeatures?.yearsExperience ?? item.evaluation?.candidateFeatures?.yearsExperience} Yrs"`,
      `"${item.candidateFeatures?.education ?? item.evaluation?.candidateFeatures?.education}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TalentMatrix_Candidate_Leaderboard_${jobReq.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedCsv(true);
    setTimeout(() => setExportedCsv(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Bulk Resume Screening Hub</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Effortless Batch Resume Evaluation & Leaderboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Drop multiple resume files at once. Automatically anonymizes PII, calculates scores, ranks candidates, and generates official offer letters.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Auto-Pilot Toggle */}
          <button
            onClick={() => setAutoPilot(!autoPilot)}
            className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors flex items-center space-x-1.5 cursor-pointer ${
              autoPilot 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${autoPilot ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`} />
            <span>{autoPilot ? 'Auto-Pilot Mode: ON' : 'Auto-Pilot: OFF'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {exportedCsv ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exportedCsv ? 'Leaderboard Exported!' : 'Export CSV Leaderboard'}</span>
          </button>
        </div>
      </div>

      {/* 1-Click Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`panel p-6 border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
          dragActive ? 'border-sky-500 bg-sky-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
        }`}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleProcessFiles(e.target.files)}
          accept=".pdf,.txt,.md,.docx"
          className="hidden"
        />

        <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 mx-auto flex items-center justify-center text-sky-400">
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-100">
            {isProcessing ? 'Processing Resumes in Parallel...' : 'Click or Drag & Drop Multiple Resume Files Here'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Select 5, 10, or 50 resumes at once (PDF, Word, TXT) &bull; Automatically anonymized, scored & ranked
          </p>
        </div>
      </div>

      {/* Ranked Candidates Leaderboard */}
      <div className="panel space-y-4">
        <div className="panel-header flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            <span>Candidate Evaluation Leaderboard ({displayList.length} Processed)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Sorted by Highest Match Score</span>
        </div>

        <div className="p-4 pt-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Candidate Reference</th>
                <th className="py-2.5 px-3">Tier Category</th>
                <th className="py-2.5 px-3">Match Score</th>
                <th className="py-2.5 px-3">Must-Haves Met</th>
                <th className="py-2.5 px-3">Missing Gaps</th>
                <th className="py-2.5 px-3">Experience</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayList.map((item, idx) => {
                const category = item.category || item.evaluation?.category || 'Evaluating...';
                const score = item.scores?.overall ?? item.evaluation?.scores?.overall ?? 0;
                const matched = item.skillMatch?.matchedMustHaves || item.evaluation?.skillMatch?.matchedMustHaves || [];
                const missing = item.skillMatch?.missingMustHaves || item.evaluation?.skillMatch?.missingMustHaves || [];
                const exp = item.candidateFeatures?.yearsExperience ?? item.evaluation?.candidateFeatures?.yearsExperience ?? 0;
                const isRejected = item.isRejected || category.includes('Rejected');

                return (
                  <tr key={item.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-100">{item.name.split('/')[0].trim()}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.fileName || item.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                        isRejected ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        category === 'Top Tier' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                        category === 'Qualified' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}>
                        {category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-base text-slate-100">{score}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-semibold">{matched.length} / {jobReq.mustHaveSkills.length}</span>
                    </td>
                    <td className="py-3 px-3">
                      {missing.length > 0 ? (
                        <span className="text-rose-400 font-mono text-[11px]">{missing.join(', ')}</span>
                      ) : (
                        <span className="text-emerald-400 text-[11px]">None (100% Met)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{exp} Yrs</td>
                    
                    {/* Actions Col: Generate Offer, Reject & Delete */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {!isRejected && (
                          <button
                            onClick={() => onGenerateOffer && onGenerateOffer(item)}
                            className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                            title="Generate Official Offer Letter"
                          >
                            <FileCheck className="w-3 h-3 text-emerald-400" />
                            <span>Offer Letter</span>
                          </button>
                        )}

                        {!isRejected && (
                          <button
                            onClick={() => onRejectCandidate && onRejectCandidate(item.id)}
                            className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                            title="Reject Candidate Directly"
                          >
                            <Ban className="w-3 h-3 text-amber-400" />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteCandidate && onDeleteCandidate(item.id)}
                          className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Purge Candidate from Database"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
