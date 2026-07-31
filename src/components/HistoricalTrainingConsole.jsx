import React from 'react';
import { History, BrainCircuit, TrendingUp, Award } from 'lucide-react';
import { HISTORICAL_PAST_HIRES, trainHistoricalPatternBaseline } from '../services/historicalTrainer';

export default function HistoricalTrainingConsole({ jobReq }) {
  const trainedBaseline = trainHistoricalPatternBaseline(jobReq?.id);
  const relevantHires = HISTORICAL_PAST_HIRES.filter(h => h.roleId === jobReq?.id || !jobReq?.id);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5">
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">Historical Hire Pattern Training Console</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Extracts skill co-occurrences and career velocity metrics from successful past hires for <span className="font-semibold text-slate-200">{jobReq?.title}</span>.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trained Profiles</span>
          <div className="mt-2 text-2xl font-bold text-slate-100">{trainedBaseline.totalTrainedHires} Hires</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">Anonymized Dataset</div>
        </div>

        <div className="panel p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Tenure at Hire</span>
          <div className="mt-2 text-2xl font-bold text-purple-400">{trainedBaseline.avgTenureMonths} Months</div>
          <div className="mt-1 text-xs text-slate-500 font-medium font-mono">Retention Benchmark</div>
        </div>

        <div className="panel p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Baseline Experience</span>
          <div className="mt-2 text-2xl font-bold text-sky-400">{trainedBaseline.avgYearsExperienceBeforeHire} Years</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">Pre-Hire Average</div>
        </div>

        <div className="panel p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Past Hire Rating</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400">4.85 / 5.0</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">High Performer Standard</div>
        </div>
      </div>

      {/* Top Correlated Skills & Trajectory Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Correlated Skill Trait Model */}
        <div className="lg:col-span-6 panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Top Correlated Success Traits</span>
          </h3>

          <div className="space-y-3">
            {trainedBaseline.topCorrelatedSkills.map((item, idx) => (
              <div key={idx} className="p-3 rounded-md bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>{item.skill}</span>
                  <span className="text-sky-400 font-mono">{item.correlationPercent}% Correlation</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full" 
                    style={{ width: `${item.correlationPercent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Anonymized Historical Hire Profiles */}
        <div className="lg:col-span-6 panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Anonymized Hire Training Dataset</span>
          </h3>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {relevantHires.map((hire) => (
              <div key={hire.id} className="p-3.5 rounded-md bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{hire.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    Rating: {hire.performanceRating}★
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  "{hire.anonymizedSummary}"
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hire.skills.map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
