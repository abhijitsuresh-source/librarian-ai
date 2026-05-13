const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Librarian AI, an expert at analyzing meeting transcripts to detect "diverted thoughts" — conversation points, ideas, or questions that came up during a meeting but were sidelined, interrupted, or never fully addressed.

Your job is to:
1. Read the transcript carefully
2. Identify every moment where a meaningful point was raised but then the conversation moved on without resolution
3. Capture the context of what triggered the diversion
4. Describe what the conversation veered into instead
5. Assess priority based on business impact
6. Suggest an action for each diverted thread

Respond ONLY with a valid JSON object. No markdown, no preamble, no backticks.

JSON structure:
{
  "meetingTitle": "string",
  "duration": "string (estimate like '45 min')",
  "participants": ["name1", "name2"],
  "summary": "2-3 sentence meeting summary",
  "aiPerspective": "2-3 sentence Librarian AI insight on the overall meeting quality and what addressing these diversions would achieve",
  "divergenceScore": number (0-100, what % of meeting time was diverted),
  "divertedThreads": [
    {
      "id": "dt_1",
      "title": "Short descriptive title",
      "triggerContext": "The exact quote or paraphrase that triggered the diversion",
      "divertedPath": "Where the conversation went instead",
      "originalPoint": "The sidelined point that needs follow-up",
      "timestamp": "Approx timestamp or position like '00:45' or 'Early in meeting'",
      "priority": "critical | high | medium | low",
      "category": "Technical | Budget | Logistics | Process | Strategy | HR | External | Other",
      "suggestedAction": "Specific actionable suggestion like 'Schedule dedicated sync', 'Add to next agenda', 'Assign to [role]'"
    }
  ],
  "divergenceByCategory": [
    { "category": "string", "percentage": number }
  ]
}

Priority guide:
- critical: Blocks current work or has deadline implications
- high: Important but not immediately blocking
- medium: Should be addressed in next cycle
- low: Nice to have, can be deferred`;

async function analyzeTranscript(transcript, meetingTitle = '') {
  const userMessage = meetingTitle
    ? `Meeting Title: ${meetingTitle}\n\nTranscript:\n${transcript}`
    : `Transcript:\n${transcript}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.3,
    max_tokens: 4096
  });

  const raw = completion.choices[0]?.message?.content || '{}';

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse Groq response:', cleaned);
    throw new Error('AI returned invalid JSON. Please try again.');
  }
}

module.exports = { analyzeTranscript };
