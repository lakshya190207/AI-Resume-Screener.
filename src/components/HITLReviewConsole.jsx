import React, { useState } from 'react';
import { UserCheck, CheckCircle2, RefreshCw, Sliders } from 'lucide-react';
import { SAMPLE_HITL_REVIEWS, calculateWeightRecalibration } from '../services/hitlFeedback';

export default function HITLReviewConsole({ currentWeights, onApplyRecalibratedWeights }) {
  const [reviews, setReviews] = useState(SAMPLE_HITL_REVIEWS);
  const [selectedReviewId, setSelectedReviewId] = useState(SAMPLE_HITL_REVIEWS[0].id);
  const [overrideAction, setOverrideAction] = useState('Approved');
  const [recruiterNotes, setRecruiterNotes] = useState('');

  const activeReview = reviews.find(r => r.id === selectedReviewId) || reviews[0];

  const recalibration = calculateWeightRecalibration(reviews, currentWeights);

  const handleAuditSubmit = () => {
    setReviews(prev => prev.map(r => {
      if (r.id === selectedReviewId) {
        return {
          ...r,
          recruiterAction: overrideAction,
          recruiterNotes: recruiterNotes || r.recruiterNotes,
          timestamp: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5">
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">Recruiter Audit & Weight Recalibration</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          25% sample of candidate evaluations are audited by human recruiters to fine-tune scoring weights.
        </p>
      </div>

      {/* Recalibration Box */}
      {recalibration.hasSuggestion && (
        <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-300 uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Weight Recalibration Recommendation</span>
            </div>

            <button
              onClick={() => onApplyRecalibratedWeights(recalibration.recommendedWeights)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Apply Recommended Weights
            </button>
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            {recalibration.rationale.map((rat, idx) => (
              <p key={idx} className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{rat}</span>
              </p>
            ))}
          </div>

          <div className="pt-1 text-[11px] text-slate-400 font-mono">
            Target Weights: Must-Haves: {recalibration.recommendedWeights.mustHaves}% | Nice-To-Haves: {recalibration.recommendedWeights.niceToHaves}% | Exp: {recalibration.recommendedWeights.experience}% | Edu: {recalibration.recommendedWeights.education}%
          </div>
        </div>
      )}

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Sample Audit Queue */}
        <div className="lg:col-span-5 panel p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
            Pending Recruiter Audit Queue (25% Sample)
          </h3>

          <div className="space-y-2">
            {reviews.map((r) => {
              const isSelected = r.id === selectedReviewId;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedReviewId(r.id);
                    setOverrideAction(r.recruiterAction);
                    setRecruiterNotes(r.recruiterNotes);
                  }}
                  className={`p-3 rounded-md border transition-colors cursor-pointer space-y-1.5 ${
                    isSelected 
                      ? 'bg-slate-900 border-sky-500' 
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-100">{r.candidateAlias}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{r.jobTitle}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Agent: <strong className="text-slate-200">{r.agentCategory} ({r.agentScore}%)</strong></span>
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      r.recruiterAction.includes('Approved') ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {r.recruiterAction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Active Recruiter Audit Panel */}
        <div className="lg:col-span-7 panel p-5 space-y-5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Audit & Classification Override Panel</span>
          </h3>

          <div className="p-4 rounded-md bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-100 text-sm">{activeReview.candidateAlias}</span>
              <span className="text-slate-300 font-medium">{activeReview.jobTitle}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Agent Category</span>
                <span className="font-bold text-emerald-400 text-sm">{activeReview.agentCategory}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Agent Score</span>
                <span className="font-bold text-slate-100 text-sm">{activeReview.agentScore} / 100</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-slate-400 font-medium block mb-1">Recruiter Notes:</span>
              <p className="text-slate-200 italic bg-slate-900 p-2.5 rounded border border-slate-800 font-mono">
                "{activeReview.recruiterNotes}"
              </p>
            </div>
          </div>

          {/* Action Radio Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Recruiter Decision Action:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'Approved', label: 'Approve Decision' },
                { val: 'Override -> Top Tier', label: 'Override: Top Tier' },
                { val: 'Override -> Not a Match', label: 'Override: Reject' }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setOverrideAction(opt.val)}
                  className={`p-2.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                    overrideAction === opt.val
                      ? 'bg-sky-600 text-white border-sky-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Audit Comment:</label>
            <textarea
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="e.g. Must-have weight should be higher..."
            />
          </div>

          <button
            onClick={handleAuditSubmit}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer"
          >
            Save Audit Review & Log Feedback
          </button>
        </div>

      </div>
    </div>
  );
}
