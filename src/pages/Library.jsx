import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PRIORITY_DOT = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-400',
  low: 'bg-green-500'
};

export default function Library() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://librarian-ai.onrender.com/api/analyses')
      .then(r => setAnalyses(r.data.analyses || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="mesh-bg min-h-screen flex items-center justify-center">
      <svg className="animate-spin w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="font-display text-3xl font-black text-white mb-1">Analysis Library</h1>
            <p className="text-slate-500 text-sm">{analyses.length} meeting{analyses.length !== 1 ? 's' : ''} analysed</p>
          </div>
          <Link
            to="/tool"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            + New Analysis
          </Link>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">◎</div>
            <div className="text-slate-400 text-lg font-display font-bold mb-2">No analyses yet</div>
            <p className="text-slate-600 text-sm mb-6">Upload your first meeting transcript to get started.</p>
            <Link to="/tool" className="text-indigo-400 text-sm hover:underline">Analyse a transcript →</Link>
          </div>
        ) : (
          <div className="space-y-3 fade-up fade-up-1">
            {analyses.map(a => {
              const topPriorities = ['critical', 'high', 'medium', 'low']
                .filter(p => (a.divertedThreads || []).some(t => t.priority === p));
              const pendingCount = (a.divertedThreads || []).filter(t => t.status === 'pending').length;
              const date = new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <Link
                  key={a._id}
                  to={`/analysis/${a._id}`}
                  className="flex items-center justify-between p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30 transition-all">
                      <span className="text-indigo-400 text-sm">✦</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-[15px] truncate mb-1">{a.meetingTitle}</div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-slate-500">{date}</span>
                        {a.duration && <span className="text-xs text-slate-600">{a.duration}</span>}
                        <span className="text-xs text-slate-600">{(a.divertedThreads || []).length} threads</span>
                        {pendingCount > 0 && (
                          <span className="text-xs text-yellow-400">{pendingCount} pending</span>
                        )}
                        {/* Priority dots */}
                        <div className="flex gap-1">
                          {topPriorities.map(p => (
                            <div key={p} className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p]}`} title={p}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="text-lg font-bold text-sky-400 font-display">{a.divergenceScore}%</div>
                      <div className="text-[10px] text-slate-600 uppercase tracking-widest">Diverged</div>
                    </div>
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
