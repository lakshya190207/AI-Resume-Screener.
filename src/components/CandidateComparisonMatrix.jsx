import React, { useState, useEffect } from 'react';
import { Columns, CheckCircle2, XCircle, Award, ArrowUpDown, ChevronRight } from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { scoreCandidateResume } from '../services/scoringEngine';

export default function CandidateComparisonMatrix({ jobReq, customWeights, candidatesList }) {
  // Use passed candidatesList if available, else evaluate SAMPLE_RESUMES
  const evaluatedCandidates = (candidatesList && candidatesList.length > 0)
    ? candidatesList
    : SAMPLE_RESUMES.map(sample => {
        const evaluation = scoreCandidateResume(sample.rawText, jobReq, customWeights);
        return {
          id: sample.id,
          name: sample.name,
          label: sample.label || sample.fileName || 'Sample Candidate',
          ...evaluation
        };
      });

  const [selectedCandidateIds, setSelectedCandidateIds] = useState(() => 
    evaluatedCandidates.slice(0, 2).map(c => c.id)
  );

  // Sync selected candidates if evaluatedCandidates change
  useEffect(() => {
    if (selectedCandidateIds.length === 0 && evaluatedCandidates.length > 0) {
      setSelectedCandidateIds(evaluatedCandidates.slice(0, 2).map(c => c.id));
    }
  }, [evaluatedCandidates]);

  const activeCandidates = evaluatedCandidates.filter(c => selectedCandidateIds.includes(c.id));

  const toggleCandidate = (id) => {
    if (selectedCandidateIds.includes(id)) {
      if (selectedCandidateIds.length > 1) {
        setSelectedCandidateIds(prev => prev.filter(i => i !== id));
      }
    } else {
      if (selectedCandidateIds.length < 4) {
        setSelectedCandidateIds(prev => [...prev, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Candidate Comparison Matrix</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side candidate comparison across Must-Have coverage, experience depth, and trajectory scores.
          </p>
        </div>

        {/* Candidate Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Candidates (Max 4):</span>
          {evaluatedCandidates.map(c => {
            const isSelected = selectedCandidateIds.includes(c.id);
            const displayName = c.name ? c.name.split('/')[0].trim() : (c.fileName || c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidate(c.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-sky-600 text-white border-sky-500' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              <th className="p-4 font-bold text-slate-400 uppercase tracking-wider w-48">Evaluation Metric</th>
              {activeCandidates.map(c => (
                <th key={c.id} className="p-4 font-bold text-slate-100 min-w-[220px]">
                  <div className="text-sm">{c.name ? c.name.split('/')[0].trim() : c.fileName}</div>
                  <div className="text-[11px] text-slate-400 font-normal">{c.label || c.fileName}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {/* Category Tier Row */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Tier Classification</td>
              {activeCandidates.map(c => {
                const category = c.category || c.evaluation?.category || 'Evaluating...';
                return (
                  <td key={c.id} className="p-4">
                    <span className={`px-2.5 py-1 rounded font-bold text-xs ${
                      category === 'Top Tier' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      category === 'Qualified' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {category}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Overall Weighted Score */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Weighted Overall Score</td>
              {activeCandidates.map(c => {
                const score = c.scores?.overall ?? c.evaluation?.scores?.overall ?? 0;
                return (
                  <td key={c.id} className="p-4 font-bold text-base text-slate-100">
                    {score} / 100
                  </td>
                );
              })}
            </tr>

            {/* Must-Haves Coverage */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Must-Haves Coverage</td>
              {activeCandidates.map(c => {
                const mustScore = c.scores?.mustHaves ?? c.evaluation?.scores?.mustHaves ?? 0;
                const matched = c.skillMatch?.matchedMustHaves || c.evaluation?.skillMatch?.matchedMustHaves || [];
                const missing = c.skillMatch?.missingMustHaves || c.evaluation?.skillMatch?.missingMustHaves || [];
                return (
                  <td key={c.id} className="p-4">
                    <div className="font-bold text-emerald-400 mb-1">{mustScore}%</div>
                    <div className="flex flex-wrap gap-1">
                      {matched.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          ✓ {s}
                        </span>
                      ))}
                      {missing.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          ✗ {s}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Nice-To-Haves Bonus */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Nice-To-Haves Bonus</td>
              {activeCandidates.map(c => {
                const niceScore = c.scores?.niceToHaves ?? c.evaluation?.scores?.niceToHaves ?? 0;
                const matchedNice = c.skillMatch?.matchedNiceToHaves || c.evaluation?.skillMatch?.matchedNiceToHaves || [];
                return (
                  <td key={c.id} className="p-4">
                    <div className="font-bold text-sky-400 mb-1">{niceScore}%</div>
                    <div className="text-[11px] text-slate-400">
                      Matched: {matchedNice.join(', ') || 'None'}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Experience Depth */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Experience Depth</td>
              {activeCandidates.map(c => {
                const expYears = c.candidateFeatures?.yearsExperience ?? c.evaluation?.candidateFeatures?.yearsExperience ?? 0;
                const expScore = c.scores?.experience ?? c.evaluation?.scores?.experience ?? 0;
                return (
                  <td key={c.id} className="p-4">
                    <div className="font-bold text-slate-200">{expYears} Years</div>
                    <div className="text-[11px] text-slate-400">Score: {expScore}%</div>
                  </td>
                );
              })}
            </tr>

            {/* Education Degree */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Education Degree</td>
              {activeCandidates.map(c => {
                const edu = c.candidateFeatures?.education ?? c.evaluation?.candidateFeatures?.education ?? 'B.S.';
                const eduScore = c.scores?.education ?? c.evaluation?.scores?.education ?? 0;
                return (
                  <td key={c.id} className="p-4">
                    <div className="font-bold text-slate-200">{edu}</div>
                    <div className="text-[11px] text-slate-400">Score: {eduScore}%</div>
                  </td>
                );
              })}
            </tr>

            {/* Historical Trajectory */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-950/40">Historical Trajectory Match</td>
              {activeCandidates.map(c => {
                const trajScore = c.scores?.trajectory ?? c.evaluation?.scores?.trajectory ?? 0;
                const explanation = c.trajectoryAnalysis?.explanation ?? c.evaluation?.trajectoryAnalysis?.explanation ?? 'Baseline match';
                return (
                  <td key={c.id} className="p-4">
                    <div className="font-bold text-purple-400">{trajScore}%</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]" title={explanation}>
                      {explanation}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
