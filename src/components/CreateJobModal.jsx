import React, { useState } from 'react';
import { X, Plus, CheckCircle2 } from 'lucide-react';

export default function CreateJobModal({ isOpen, onClose, onCreateJob }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [minYearsExperience, setMinYearsExperience] = useState(4);
  const [requiredEducation, setRequiredEducation] = useState("Bachelor's");
  const [mustHaveInput, setMustHaveInput] = useState('');
  const [mustHaveSkills, setMustHaveSkills] = useState(['Python', 'System Architecture']);
  const [niceToHaveInput, setNiceToHaveInput] = useState('');
  const [niceToHaveSkills, setNiceToHaveSkills] = useState(['Docker', 'AWS']);

  if (!isOpen) return null;

  const handleAddMustHave = () => {
    if (mustHaveInput.trim() && !mustHaveSkills.includes(mustHaveInput.trim())) {
      setMustHaveSkills(prev => [...prev, mustHaveInput.trim()]);
      setMustHaveInput('');
    }
  };

  const handleAddNiceToHave = () => {
    if (niceToHaveInput.trim() && !niceToHaveSkills.includes(niceToHaveInput.trim())) {
      setNiceToHaveSkills(prev => [...prev, niceToHaveInput.trim()]);
      setNiceToHaveInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || mustHaveSkills.length === 0) return;

    const newJob = {
      id: `req-${Date.now()}`,
      title: title.trim(),
      department: department.trim() || 'Engineering',
      minYearsExperience: Number(minYearsExperience) || 0,
      requiredEducation,
      mustHaveSkills,
      niceToHaveSkills,
      defaultWeights: {
        mustHaves: 40,
        niceToHaves: 20,
        experience: 20,
        education: 10,
        trajectory: 10
      },
      description: `Custom job requisition for ${title.trim()}.`
    };

    onCreateJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111622] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100">Create New Job Requisition Baseline</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Principal Security Architect"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Department</label>
              <input
                type="text"
                placeholder="e.g. Infrastructure"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Min Experience (Yrs)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={minYearsExperience}
                onChange={(e) => setMinYearsExperience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Required Education Level</label>
            <select
              value={requiredEducation}
              onChange={(e) => setRequiredEducation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="High School">High School Diploma</option>
              <option value="Associate">Associate Degree</option>
              <option value="Bachelor's">Bachelor's Degree</option>
              <option value="Master's">Master's Degree</option>
              <option value="Ph.D.">Ph.D.</option>
            </select>
          </div>

          {/* Must-Haves */}
          <div className="space-y-2">
            <label className="block text-emerald-400 font-bold">Must-Have Skills *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Kubernetes"
                value={mustHaveInput}
                onChange={(e) => setMustHaveInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMustHave())}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMustHave}
                className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded font-semibold text-xs cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {mustHaveSkills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Nice-To-Haves */}
          <div className="space-y-2">
            <label className="block text-sky-400 font-bold">Nice-To-Have Skills</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Terraform"
                value={niceToHaveInput}
                onChange={(e) => setNiceToHaveInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNiceToHave())}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddNiceToHave}
                className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded font-semibold text-xs cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {niceToHaveSkills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-slate-400 font-semibold text-xs rounded hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || mustHaveSkills.length === 0}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              Create Job Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
