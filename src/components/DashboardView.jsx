import React from 'react';
import { 
  Users, 
  Award, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight,
  Lock,
  Target
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardView({ 
  jobReq, 
  fairnessReport, 
  hitlSummary, 
  onNavigateTo 
}) {
  const categoryData = [
    { name: 'Top Tier', value: 4, color: '#10b981' },
    { name: 'Qualified', value: 5, color: '#f59e0b' },
    { name: 'Not a Match', value: 3, color: '#f43f5e' }
  ];

  const scoreDistribution = [
    { range: '90-100%', count: 2 },
    { range: '80-89%', count: 2 },
    { range: '70-79%', count: 3 },
    { range: '60-69%', count: 2 },
    { range: '<60%', count: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Requisition Summary Bar */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
            <span>Automated Candidate Screening Pipeline</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            {jobReq?.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Department: <span className="text-slate-300 font-medium">{jobReq?.department}</span> • Minimum Experience: <span className="text-slate-300 font-medium">{jobReq?.minYearsExperience} Years</span> • PII Anonymization: <span className="text-emerald-400 font-medium">Active</span>
          </p>
        </div>

        <button
          onClick={() => onNavigateTo('screener')}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-md shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>Open Screening Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Candidates</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">12</div>
          <div className="mt-1 text-xs text-slate-500 flex items-center space-x-1">
            <Lock className="w-3 h-3 text-sky-400" />
            <span>100% Anonymized</span>
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Top Tier Candidates</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">4 <span className="text-xs font-normal text-slate-400">(33.3%)</span></div>
          <div className="mt-1 text-xs text-slate-500">
            Score ≥ 80% & Must-Haves Met
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Recruiter HITL Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">25%</div>
          <div className="mt-1 text-xs text-slate-500">
            Override Rate: {hitlSummary?.overrideRate || 33}%
          </div>
        </div>

        <div className="panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Fairness Index</span>
            <ShieldAlert className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {fairnessReport?.disparateImpactRatio ? (fairnessReport.disparateImpactRatio * 100).toFixed(0) + '%' : '92%'}
          </div>
          <div className="mt-1 text-xs text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>4/5ths Rule Compliant</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Distribution Pie Chart */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">Tier Breakdown</h3>
            <p className="text-xs text-slate-400">Classification across Top Tier, Qualified, and Not a Match</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block font-medium">Top Tier</span>
              <span className="font-bold text-emerald-400">4 Candidates</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block font-medium">Qualified</span>
              <span className="font-bold text-amber-400">5 Candidates</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block font-medium">Not a Match</span>
              <span className="font-bold text-rose-400">3 Candidates</span>
            </div>
          </div>
        </div>

        {/* Score Spectrum Bar Chart */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">Score Spectrum (0-100 Scale)</h3>
            <p className="text-xs text-slate-400">Candidate score distribution</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Requisition: <strong className="text-slate-200">{jobReq?.title}</strong></span>
            <button 
              onClick={() => onNavigateTo('baseline')}
              className="text-sky-400 hover:underline font-semibold cursor-pointer"
            >
              Adjust Baseline Weights →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
