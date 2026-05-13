const express = require('express');
const multer = require('multer');
const router = express.Router();
const { analyzeTranscript } = require('../services/groqService');
const { sendDigestEmail } = require('../services/emailService');
const Analysis = require('../models/Analysis');

// Multer: memory storage for .txt file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are supported'), false);
    }
  }
});

// POST /api/analyze
// Body: { transcript, meetingTitle, hostEmail } OR multipart with file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    let transcript = req.body.transcript || '';
    const meetingTitle = req.body.meetingTitle || 'Untitled Meeting';
    const hostEmail = req.body.hostEmail || process.env.HOST_EMAIL;

    // If file was uploaded, use its text
    if (req.file) {
      transcript = req.file.buffer.toString('utf-8');
    }

    if (!transcript || transcript.trim().length < 50) {
      return res.status(400).json({ error: 'Transcript is too short or missing.' });
    }

    // Run Groq AI analysis
    console.log(`🔍 Analyzing transcript for: ${meetingTitle}`);
    const aiResult = await analyzeTranscript(transcript, meetingTitle);

    // Build DB document
    const analysisDoc = new Analysis({
      meetingTitle: aiResult.meetingTitle || meetingTitle,
      duration: aiResult.duration,
      participants: aiResult.participants || [],
      rawTranscript: transcript,
      summary: aiResult.summary,
      aiPerspective: aiResult.aiPerspective,
      divergenceScore: aiResult.divergenceScore || 0,
      divertedThreads: (aiResult.divertedThreads || []).map((t, i) => ({
        ...t,
        id: t.id || `dt_${i + 1}`,
        status: 'pending'
      })),
      divergenceByCategory: aiResult.divergenceByCategory || []
    });

    await analysisDoc.save();
    console.log(`✅ Analysis saved: ${analysisDoc._id}`);

    // Send digest email
    if (hostEmail) {
      try {
        await sendDigestEmail(analysisDoc, hostEmail);
        analysisDoc.emailSent = true;
        analysisDoc.emailSentAt = new Date();
        await analysisDoc.save();
        console.log(`📧 Digest email sent to ${hostEmail}`);
      } catch (emailErr) {
        console.error('Email send failed (non-fatal):', emailErr.message);
      }
    }

    res.json({
      success: true,
      analysisId: analysisDoc._id,
      data: analysisDoc
    });

  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
  }
});

module.exports = router;
