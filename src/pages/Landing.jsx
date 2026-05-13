import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '↪',
    title: 'Divergence Detection',
    desc: 'Llama-3 pinpoints every moment a thread was sidelined — with trigger context and the path conversation took instead.'
  },
  {
    icon: '⬡',
    title: 'Priority Triage',
    desc: 'Critical, High, Medium, Low — colour-coded so you instantly see what needs attention before the next sync.'
  },
  {
    icon: '✉',
    title: 'Digest to Your Inbox',
    desc: 'A beautiful HTML email lands in the meeting host\'s inbox with all threads, context, and suggested actions.'
  },
  {
    icon: '◎',
    title: 'Review & Action Center',
    desc: 'Mark threads as Follow Up, Deferred, or Resolved. See divergence heatmap by category.'
  }
];

export default function Landing() {
  return (
    <div className="mesh-bg min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">L</div>
          <span className="font-display font-bold text-white tracking-tight">Librarian AI</span>
        </div>
        <Link
          to="/tool"
          className="text-sm font-medium text-indigo-300 border border-indigo-500/40 px-4 py-2 rounded-lg hover:bg-indigo-600/20 transition-all"
        >
          Open Tool →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot"></span>
          Powered by Groq · Llama-3
        </div>

        <h1 className="fade-up fade-up-1 font-display text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
          Every meeting has<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            threads that drift.
          </span>
        </h1>

        <p className="fade-up fade-up-2 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
          Librarian AI reads your meeting transcript and surfaces every idea, question, and decision point that got sidelined — before it's forgotten forever.
        </p>

        <div className="fade-up fade-up-3 flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/tool"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Analyse a Transcript
          </Link>
          <Link
            to="/library"
            className="px-8 py-3.5 bg-white/[0.06] hover:bg-white/[0.10] text-white font-medium rounded-xl border border-white/10 transition-all"
          >
            View Library
          </Link>
        </div>
      </section>

      {/* Mock transcript snippet */}
      <section className="fade-up fade-up-4 max-w-3xl mx-auto px-6 mb-20">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f1a] overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
            <span className="ml-3 text-xs text-slate-500 font-mono">Q4 Roadmap Alignment · 45:12</span>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 text-xs flex items-center justify-center flex-shrink-0 font-bold">A</div>
              <div>
                <span className="text-slate-500 text-xs mr-2">Alex</span>
                <span className="text-slate-300">We have the SSO rollout scheduled for November.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 text-xs flex items-center justify-center flex-shrink-0 font-bold">J</div>
              <div>
                <span className="text-slate-500 text-xs mr-2">Jordan</span>
                <span className="text-slate-300">Right, speaking of resources — I saw a report about the <span className="text-yellow-300 underline decoration-yellow-500/50">new office chairs</span>...</span>
              </div>
            </div>
            {/* Divergence detected callout */}
            <div className="ml-9 flex items-start gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <span className="text-orange-400 text-base">↪</span>
              <div>
                <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-0.5">Logistics Tangent detected</div>
                <div className="text-xs text-slate-400">SSO rollout discussion was sidelined → cafeteria logistics</div>
              </div>
            </div>
            <div className="flex gap-3 opacity-40">
              <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 text-xs flex items-center justify-center flex-shrink-0 font-bold">E</div>
              <div>
                <span className="text-slate-500 text-xs mr-2">Elena</span>
                <span className="text-slate-300">The core module is finished. We're in testing phase...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-xl mb-4 group-hover:bg-indigo-600/30 transition-all">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-slate-600 text-sm">
        Librarian AI — Built with Groq · MongoDB · Express · React · Node.js · All free tier.
      </footer>
    </div>
  );
}
