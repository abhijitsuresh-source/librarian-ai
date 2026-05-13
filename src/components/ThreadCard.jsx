import React, { useState } from 'react';
import axios from 'axios';

const PRIORITY_STYLES = {
  critical: { dot: 'bg-red-500',    text: 'text-red-400',    border: 'border-red-500/30',    bg: 'bg-red-500/[0.07]',    badge: 'text-red-400 bg-red-500/10 border-red-500/30' },
  high:     { dot: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/[0.07]', badge: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  medium:   { dot: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/[0.07]', badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  low:      { dot: 'bg-green-500',  text: 'text-green-400',  border: 'border-green-500/30',  bg: 'bg-green-500/[0.07]',  badge: 'text-green-400 bg-green-500/10 border-green-500/30' }
};

const STATUS_LABELS = {
  pending:   { label: 'Pending',   color: 'text-slate-400' },
  followUp:  { label: 'Follow Up', color: 'text-indigo-400' },
  deferred:  { label: 'Deferred',  color: 'text-yellow-400' },
  resolved:  { label: 'Resolved',  color: 'text-green-400' }
};

export default function ThreadCard({ thread, analysisId, index, onUpdate }) {
  const [status, setStatus] = useState(thread.status || 'pending');
  const [expanded, setExpanded] = useState(index < 2);
  const [saving, setSaving] = useState(false);

  const p = PRIORITY_STYLES[thread.priority] || PRIORITY_STYLES.medium;

  const updateStatus = async (newStatus) => {
    setSaving(true);
    try {
      await axios.patch(`/api/analyses/${analysisId}/threads/${thread.id}`, { status: newStatus });
      setStatus(newStatus);
      onUpdate && onUpdate(thread.id, newStatus);
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`rounded-2xl border ${p.border} ${p.bg} overflow-hidden transition-all`}>
      {/* Header row */}
      <div
        className="flex items-start justify-between px-5 pt-5 pb-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-2 h-2 rounded-full ${p.dot} mt-1.5 flex-shrink-0`}></div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${p.badge}`}>
                {thread.priority}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{thread.category}</span>
              <span className="text-[10px] text-slate-600 font-mono">{thread.timestamp}</span>
            </div>
            <h3 className="text-white font-semibold text-[15px] leading-snug">{thread.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <span className={`text-xs font-medium ${STATUS_LABELS[status]?.color || 'text-slate-400'}`}>
            {STATUS_LABELS[status]?.label}
          </span>
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/[0.05] pt-4">
          {/* Trigger context */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">💬 Trigger Context</div>
            <div className="text-sm text-slate-400 italic bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/[0.06]">
              "{thread.triggerContext}"
            </div>
          </div>

          {/* Diverted path */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">↪ Conversation Diverted To</div>
            <div className="text-sm text-slate-300">{thread.divertedPath}</div>
          </div>

          {/* Sidelined point */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">📌 Sidelined Point</div>
            <div className="text-sm text-white font-medium">{thread.originalPoint}</div>
          </div>

          {/* Suggested action */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
            <span className="text-indigo-400 text-sm flex-shrink-0">→</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Suggested Action </span>
              <span className="text-sm text-indigo-200">{thread.suggestedAction}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {['followUp', 'deferred', 'resolved', 'pending'].map(s => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={saving || status === s}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  status === s
                    ? 'bg-white/10 border-white/20 text-white cursor-default'
                    : 'border-white/10 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-600/10'
                }`}
              >
                {STATUS_LABELS[s].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
