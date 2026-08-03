import React from 'react';
import { CheckCircle2, Sparkles, X, UploadCloud, Ban, Trash2 } from 'lucide-react';

export default function ToastNotification({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-5 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isDelete = toast.type === 'delete';
        const isReject = toast.type === 'reject';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-xl p-4 shadow-2xl backdrop-blur-md flex items-start space-x-3 transform transition-all duration-300 animate-slide-in ${
              isDelete ? 'bg-rose-950/90 border-rose-500/50 shadow-rose-950/80' :
              isReject ? 'bg-amber-950/90 border-amber-500/50 shadow-amber-950/80' :
              'bg-[#111726] border-sky-500/40 shadow-sky-950/80'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${
              isDelete ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              isReject ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-sky-500/10 text-sky-400 border border-sky-500/20'
            }`}>
              {isDelete ? <Trash2 className="w-5 h-5 animate-pulse" /> :
               isReject ? <Ban className="w-5 h-5 animate-pulse" /> :
               <UploadCloud className="w-5 h-5 animate-bounce" />}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>{isDelete ? 'Database Record Purged' : isReject ? 'Candidate Rejected' : 'Resume Uploaded & Screened'}</span>
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

              <p className="text-[11px] text-slate-400 leading-tight">
                {toast.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
