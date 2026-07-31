import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Lock, BarChart2 } from 'lucide-react';
import { executeFairnessAudit, ISOLATED_DEMOGRAPHIC_VAULT } from '../services/fairnessAuditor';

export default function FairnessAuditConsole({ onTriggerWeightReview }) {
  const [demographics, setDemographics] = useState(ISOLATED_DEMOGRAPHIC_VAULT);
  const audit = executeFairnessAudit(demographics);

  const isAlert = audit.status === 'DISPARITY_ALERT';

  const handleSimulateDisparity = () => {
    // Inject non-matching candidates to simulate disparity alert
    const skewedPool = [
      ...demographics,
      { candidateId: 'cand-99', gender: 'Female', ageGroup: '50+', ethnicityGroup: 'Underrepresented Minority', category: 'Not a Match' },
      { candidateId: 'cand-98', gender: 'Female', ageGroup: '40-49', ethnicityGroup: 'Underrepresented Minority', category: 'Not a Match' },
      { candidateId: 'cand-97', gender: 'Female', ageGroup: '30-39', ethnicityGroup: 'Underrepresented Minority', category: 'Not a Match' }
    ];
    setDemographics(skewedPool);
  };

  const handleResetPool = () => {
    setDemographics(ISOLATED_DEMOGRAPHIC_VAULT);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Isolated Demographic Vault</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Automated Bias Detection & Disparate Impact Audit</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demographic metadata is stored separately from screening logic. Tests against 4/5ths Rule (≥0.80 Disparate Impact Ratio).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateDisparity}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-md border border-slate-800 transition-colors cursor-pointer"
          >
            Simulate Disparity Alert
          </button>

          <button
            onClick={handleResetPool}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 font-semibold text-xs rounded-md border border-slate-800 transition-colors cursor-pointer"
          >
            Reset Vault
          </button>
        </div>
      </div>

      {/* Disparity Alert Box */}
      {audit.alerts.map((alt) => (
        <div 
          key={alt.id}
          className={`p-4 rounded-md border space-y-2 ${
            alt.severity === 'HIGH' 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-xs">
              {alt.severity === 'HIGH' ? <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" /> : <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
              <span>{alt.title}</span>
            </div>

            {alt.severity === 'HIGH' && (
              <button
                onClick={onTriggerWeightReview}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                Review Scoring Weights
              </button>
            )}
          </div>

          <p className="text-xs leading-relaxed">{alt.description}</p>
          <p className="text-[11px] font-mono opacity-80">Action: {alt.action}</p>
        </div>
      ))}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="panel p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disparate Impact Ratio</span>
          <div className={`mt-2 text-2xl font-bold ${isAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
            {audit.disparateImpactRatio}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">4/5ths Standard: ≥ 0.80</div>
        </div>

        <div className="panel p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Applicant Pool</span>
          <div className="mt-2 text-2xl font-bold text-slate-100">{audit.totalApplicants} Candidates</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">Decoupled Vault Storage</div>
        </div>

        <div className="panel p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Top Tier Rate</span>
          <div className="mt-2 text-2xl font-bold text-sky-400">{audit.overallSelectionRate}%</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">Selection Baseline</div>
        </div>
      </div>

      {/* Demographic Parity Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gender Parity */}
        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <BarChart2 className="w-4 h-4 text-sky-400" />
            <span>Gender Selection Rates</span>
          </h3>

          <div className="space-y-3">
            {audit.breakdowns.gender.map((g, idx) => (
              <div key={idx} className="p-3 rounded-md bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-200">{g.label}</span>
                  <span className="text-sky-400 font-mono">Selection Rate: {g.selectionRatePercent}%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Pool Share: {g.applicantSharePercent}% ({g.totalApplicantCount})</span>
                  <span>Top Tier Share: {g.topTierSharePercent}% ({g.topTierCount})</span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full" style={{ width: `${g.selectionRatePercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ethnicity Parity */}
        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>Ethnicity Selection Rates</span>
          </h3>

          <div className="space-y-3">
            {audit.breakdowns.ethnicity.map((eth, idx) => (
              <div key={idx} className="p-3 rounded-md bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-200">{eth.label}</span>
                  <span className="text-purple-400 font-mono">Selection Rate: {eth.selectionRatePercent}%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Pool Share: {eth.applicantSharePercent}% ({eth.totalApplicantCount})</span>
                  <span>Top Tier Share: {eth.topTierSharePercent}% ({eth.topTierCount})</span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${eth.selectionRatePercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
