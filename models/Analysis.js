const mongoose = require('mongoose');

const DivertedThreadSchema = new mongoose.Schema({
  id: String,
  title: String,
  triggerContext: String,       // what was said just before the diversion
  divertedPath: String,         // where the conversation went instead
  originalPoint: String,        // the sidelined point, verbatim-ish
  timestamp: String,            // approx time in transcript
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  category: String,             // e.g. "Technical", "Budget", "Logistics"
  suggestedAction: String,      // AI suggestion: follow up / defer / assign
  status: {
    type: String,
    enum: ['pending', 'followUp', 'deferred', 'resolved'],
    default: 'pending'
  },
  assignedTo: { type: String, default: '' }
});

const AnalysisSchema = new mongoose.Schema({
  meetingTitle: { type: String, default: 'Untitled Meeting' },
  meetingDate: { type: Date, default: Date.now },
  duration: String,
  participants: [String],
  rawTranscript: String,
  summary: String,
  aiPerspective: String,
  divergenceScore: Number,           // 0-100 overall diversion %
  divertedThreads: [DivertedThreadSchema],
  divergenceByCategory: [{
    category: String,
    percentage: Number
  }],
  emailSent: { type: Boolean, default: false },
  emailSentAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
