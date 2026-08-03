import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, X, Award, UploadCloud } from 'lucide-react';

export default function ToastNotification({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-5 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#111726] border border-sky-500/40 rounded-xl p-4 shadow-2xl shadow-sky-950/80 backdrop-blur-md flex items-start space-x-3 transform transition-all duration-300 animate-slide-in hover:border-sky-400"
        >
          <div className={`p-2 rounded-lg shrink-0 ${
            toast.category === 'Top Tier' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            toast.category === 'Qualified' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-sky-500/10 text-sky-400 border border-sky-500/20'
          }`}>
            <UploadCloud className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Resume Uploaded & Screened</span>
              </span>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-200 font-semibold truncate">
              {toast.candidateName}
            </p>

            <div className="flex items-center space-x-2 text-[11px]">
              <span className="font-bold text-sky-400">{toast.score}% Score</span>
              <span className="text-slate-600">&bull;</span>
              <span className={`font-bold ${
                toast.category === 'Top Tier' ? 'text-emerald-400' :
                toast.category === 'Qualified' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {toast.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
