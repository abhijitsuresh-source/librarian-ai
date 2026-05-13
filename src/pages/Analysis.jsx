import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ThreadCard from '../components/ThreadCard.jsx';

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export default function Analysis() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    axios.get(`https://librarian-ai.onrender.com/api/analyses/${id}`)
      .then(r => setData(r.data))
      .catch(() => setError('Analysis not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="mesh-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin w-8 h-8 text-indigo-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <div className="text-slate-400 text-sm">Loading analysis...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="mesh-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 mb-4">{error}</div>
        <Link to="/tool" className="text-indigo-400 text-sm hover:underline">← Back to Tool</Link>
      </div>
    </div>
  );

  const threads = [...(data.divertedThreads || [])].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4)
  );

  const filteredThreads = filter === 'all' ? threads : threads.filter(t => t.priority === filter);

  const counts = {
    critical: threads.filter(t => t.priority === 'critical').length,
    high: threads.filter(t => t.priority === 'high').length,
    medium: threads.filter(t => t.priority === 'medium').length,
    low: threads.filter(t => t.priority === 'low').length,
    pending: threads.filter(t => t.status === 'pending').length
  };

  const formattedDate = new Date(data.meetingDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
          <Link to="/library" className="hover:text-slate-400 transition-colors">Library</Link>
          <span>/</span>
          <span className="text-slate-400">{data.meetingTitle}</span>
        </div>

        {/* Header */}
        <div className="mb-8 fade-up">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display text-3xl font-black text-white mb-1">{data.meetingTitle}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>{formattedDate}</span>
                {data.duration && <><span>·</span><span>{data.duration}</span></>}
                {data.participants?.length > 0 && <><span>·</span><span>{data.participants.join(', ')}</span></>}
              </div>
            </div>
            {data.emailSent && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <span>✓</span> Digest email sent
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 fade-up fade-up-1">
          {[
            { label: 'Total Threads', value: threads.length, color: 'text-indigo-400' },
            { label: 'Critical', value: counts.critical, color: 'text-red-400' },
            { label: 'High', value: counts.high, color: 'text-orange-400' },
            { label: 'Pending', value: counts.pending, color: 'text-yellow-400' },
            { label: 'Divergence', value: `${data.divergenceScore}%`, color: 'text-sky-400' }
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color} font-display`}>{stat.value}</div>
              <div className="text-[10px] text-slate-600 uppercase tracking-widest mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: threads */}
          <div className="lg:col-span-2 space-y-4 fade-up fade-up-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-white text-lg">Diverted Threads</h2>
              <div className="flex gap-1">
                {['all', 'critical', 'high', 'medium', 'low'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg transition-all ${
                      filter === f
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredThreads.length === 0 ? (
              <div className="text-slate-600 text-sm text-center py-12">No threads for this filter.</div>
            ) : (
              filteredThreads.map((thread, i) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  analysisId={id}
                  index={i}
                />
              ))
            )}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-5 fade-up fade-up-3">
            {/* AI Perspective */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white">✦</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Librarian AI Perspective</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{data.aiPerspective}"</p>
            </div>

            {/* Meeting summary */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Meeting Summary</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{data.summary}</p>
            </div>

            {/* Divergence heatmap */}
            {data.divergenceByCategory?.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Divergence by Category</h3>
                <div className="space-y-3">
                  {data.divergenceByCategory.map(cat => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">{cat.category}</span>
                        <span className="text-xs font-mono text-slate-500">{cat.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript toggle */}
            {data.rawTranscript && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                <button
                  onClick={() => setShowTranscript(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span>Original Transcript</span>
                  <span>{showTranscript ? '▲' : '▼'}</span>
                </button>
                {showTranscript && (
                  <div className="px-5 pb-5 max-h-72 overflow-y-auto">
                    <pre className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap font-mono">{data.rawTranscript}</pre>
                  </div>
                )}
              </div>
            )}

            <Link
              to="/tool"
              className="block w-full text-center py-3 rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:border-indigo-500/30 text-sm font-medium transition-all"
            >
              + New Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
