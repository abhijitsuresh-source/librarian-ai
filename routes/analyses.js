const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');

// GET /api/analyses — list all (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const analyses = await Analysis.find()
      .select('-rawTranscript')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Analysis.countDocuments();
    res.json({ analyses, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analyses/:id
router.get('/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Not found' });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/analyses/:id/threads/:threadId — update thread status/assignment
router.patch('/:id/threads/:threadId', async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Not found' });

    const thread = analysis.divertedThreads.find(t => t.id === req.params.threadId);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    if (status) thread.status = status;
    if (assignedTo !== undefined) thread.assignedTo = assignedTo;

    await analysis.save();
    res.json({ success: true, thread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/analyses/:id
router.delete('/:id', async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
