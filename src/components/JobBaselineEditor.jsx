import React, { useState } from 'react';
import { Sliders, Plus, Trash2, CheckCircle2, AlertCircle, Save, RotateCcw, ShieldCheck } from 'lucide-react';
import { validateJobTemplate } from '../services/baselineTemplate';

export default function JobBaselineEditor({ 
  jobReq, 
  onSaveJobReq, 
  onResetWeights 
}) {
  const [formData, setFormData] = useState({ ...jobReq });
  const [newMustHave, setNewMustHave] = useState('');
  const [newNiceToHave, setNewNiceToHave] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { isValid, errors } = validateJobTemplate(formData);

  const totalWeight = Object.values(formData.defaultWeights || {}).reduce((acc, v) => acc + Number(v || 0), 0);

  const handleWeightChange = (key, value) => {
    const numVal = parseInt(value, 10) || 0;
    setFormData(prev => ({
      ...prev,
      defaultWeights: {
        ...prev.defaultWeights,
        [key]: numVal
      }
    }));
  };

  const addMustHave = () => {
    if (newMustHave.trim() && !formData.mustHaveSkills.includes(newMustHave.trim())) {
      setFormData(prev => ({
        ...prev,
        mustHaveSkills: [...prev.mustHaveSkills, newMustHave.trim()]
      }));
      setNewMustHave('');
    }
  };

  const removeMustHave = (skill) => {
    setFormData(prev => ({
      ...prev,
      mustHaveSkills: prev.mustHaveSkills.filter(s => s !== skill)
    }));
  };

  const addNiceToHave = () => {
    if (newNiceToHave.trim() && !formData.niceToHaveSkills.includes(newNiceToHave.trim())) {
      setFormData(prev => ({
        ...prev,
        niceToHaveSkills: [...prev.niceToHaveSkills, newNiceToHave.trim()]
      }));
      setNewNiceToHave('');
    }
  };

  const removeNiceToHave = (skill) => {
    setFormData(prev => ({
      ...prev,
      niceToHaveSkills: prev.niceToHaveSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSaveJobReq(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Job Requirements & Weight Calibration</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit inputs prevent AI hallucination and dictate candidate scoring logic.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({ ...jobReq });
              onResetWeights(jobReq.id);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-1.5 text-xs font-bold text-white rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer ${
              isValid
                ? 'bg-sky-600 hover:bg-sky-500'
                : 'bg-slate-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Baseline</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Job Baseline Requirements & Scoring Weights Successfully Updated!</span>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-3.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-1">
          {errors.map((err, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requisition Fields & Must-Haves */}
        <div className="lg:col-span-7 space-y-6">
          <div className="panel p-5 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
              Role Specification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Min Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.minYearsExperience}
                  onChange={(e) => setFormData({ ...formData, minYearsExperience: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Required Education</label>
                <select
                  value={formData.requiredEducation}
                  onChange={(e) => setFormData({ ...formData, requiredEducation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="High School">High School Diploma</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                  <option value="Ph.D.">Ph.D.</option>
                </select>
              </div>
            </div>

            {/* Must-Have Skills Editor */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Must-Have Qualifications (Hard Filters)
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Missing = Tier Penalty</span>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. PyTorch, System Architecture..."
                  value={newMustHave}
                  onChange={(e) => setNewMustHave(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMustHave())}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={addMustHave}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.mustHaveSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeMustHave(skill)}
                      className="hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Nice-to-Have Skills Editor */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Nice-To-Have Bonus Qualifications
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Bonus points</span>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Kubernetes, TensorRT..."
                  value={newNiceToHave}
                  onChange={(e) => setNewNiceToHave(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNiceToHave())}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={addNiceToHave}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.niceToHaveSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeNiceToHave(skill)}
                      className="hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Scoring Weight Sliders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="panel p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  <span>Scoring Weight Engine</span>
                </h3>
                <p className="text-[11px] text-slate-400">Total weight distribution must sum to 100%</p>
              </div>

              <div className={`px-2.5 py-0.5 rounded border font-bold text-xs ${
                totalWeight === 100 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
              }`}>
                Sum: {totalWeight}%
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              {/* Must-Haves Weight */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Must-Have Skills Weight</span>
                  <span className="font-bold text-emerald-400">{formData.defaultWeights?.mustHaves}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={formData.defaultWeights?.mustHaves || 0}
                  onChange={(e) => handleWeightChange('mustHaves', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Nice-To-Haves Weight */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Nice-To-Have Bonus Weight</span>
                  <span className="font-bold text-sky-400">{formData.defaultWeights?.niceToHaves}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={formData.defaultWeights?.niceToHaves || 0}
                  onChange={(e) => handleWeightChange('niceToHaves', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Experience Weight */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Experience Depth Weight</span>
                  <span className="font-bold text-amber-400">{formData.defaultWeights?.experience}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={formData.defaultWeights?.experience || 0}
                  onChange={(e) => handleWeightChange('experience', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Education Weight */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Education / Degree Weight</span>
                  <span className="font-bold text-slate-300">{formData.defaultWeights?.education}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={formData.defaultWeights?.education || 0}
                  onChange={(e) => handleWeightChange('education', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Trajectory Pattern Weight */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Historical Trajectory Match Weight</span>
                  <span className="font-bold text-purple-400">{formData.defaultWeights?.trajectory}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={formData.defaultWeights?.trajectory || 0}
                  onChange={(e) => handleWeightChange('trajectory', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
