import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Tool() {
  const [transcript, setTranscript] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.txt')) {
      setError('Please upload a .txt file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setTranscript(e.target.result);
    reader.readAsText(file);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!transcript.trim() || transcript.trim().length < 50) {
      setError('Please provide a transcript (at least 50 characters).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('https://librarian-ai.onrender.com/api/analyze', {
        transcript,
        meetingTitle: meetingTitle || 'Untitled Meeting',
        hostEmail
      });
      navigate(`/analysis/${data.analysisId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 fade-up">
          <h1 className="font-display text-3xl font-black text-white mb-2">Analyse a Transcript</h1>
          <p className="text-slate-400 text-sm">Paste your meeting transcript or upload a .txt file to detect diverted threads.</p>
        </div>

        <div className="space-y-5 fade-up fade-up-1">
          {/* Meeting title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Meeting Title</label>
            <input
              type="text"
              placeholder="e.g. Q4 Roadmap Alignment"
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>

          {/* Host email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Host Email <span className="text-slate-600 normal-case font-normal">(digest will be sent here)</span></label>
            <input
              type="email"
              placeholder="host@yourcompany.com"
              value={hostEmail}
              onChange={e => setHostEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>

          {/* Transcript input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Transcript</label>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`mb-3 border-2 border-dashed rounded-xl px-6 py-5 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-600/10'
                  : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.02]'
              }`}
            >
              <input ref={fileRef} type="file" accept=".txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <div className="text-slate-500 text-sm">
                <span className="text-indigo-400 font-medium">Click to upload</span> or drag & drop a <span className="font-mono text-xs">.txt</span> file
              </div>
            </div>

            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Or paste your transcript here...&#10;&#10;Alex: Good morning. Let's start with the Q4 priorities...&#10;Jordan: Right, and speaking of resources, I saw a report...&#10;Alex: Let's keep cafeteria logistics out of this sync."
              rows={14}
              className="w-full bg-[#0f0f1a] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-300 text-sm font-mono placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
            />
            {wordCount > 0 && (
              <div className="mt-1.5 text-xs text-slate-600 text-right">{wordCount.toLocaleString()} words</div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <span className="text-base">⚠</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 ${
              loading
                ? 'bg-indigo-600/40 text-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analysing with Llama-3...
              </>
            ) : (
              <>
                <span>✦</span>
                Detect Diverted Threads
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-600">
            Analysis is run via Groq AI (free tier). No transcript is stored without your consent.
          </p>
        </div>
      </div>
    </div>
  );
}
