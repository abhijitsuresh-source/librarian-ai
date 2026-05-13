const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Use Gmail App Password
  }
});

const PRIORITY_COLORS = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e'
};

const PRIORITY_BG = {
  critical: '#fef2f2',
  high:     '#fff7ed',
  medium:   '#fefce8',
  low:      '#f0fdf4'
};

function buildEmailHTML(analysis) {
  const { meetingTitle, meetingDate, participants, summary, aiPerspective,
          divergenceScore, divertedThreads, divergenceByCategory } = analysis;

  const formattedDate = new Date(meetingDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const criticalCount = divertedThreads.filter(t => t.priority === 'critical').length;
  const highCount = divertedThreads.filter(t => t.priority === 'high').length;
  const pendingCount = divertedThreads.filter(t => t.status === 'pending').length;

  const threadsHTML = divertedThreads.map((thread, i) => {
    const color = PRIORITY_COLORS[thread.priority] || '#6b7280';
    const bg = PRIORITY_BG[thread.priority] || '#f9fafb';
    return `
    <div style="margin-bottom:20px; border:1px solid #e5e7eb; border-left:4px solid ${color}; border-radius:8px; overflow:hidden; background:#ffffff;">
      <div style="padding:16px 20px; background:${bg};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${color};">${thread.priority} priority · ${thread.category}</span>
            <h3 style="margin:4px 0 0; font-size:16px; color:#111827; font-family:'Georgia',serif;">${i+1}. ${thread.title}</h3>
          </div>
          <span style="font-size:11px; color:#6b7280; white-space:nowrap; padding-left:12px;">${thread.timestamp}</span>
        </div>
      </div>
      <div style="padding:16px 20px;">
        <div style="margin-bottom:12px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#6b7280; margin-bottom:4px;">💬 TRIGGER CONTEXT</div>
          <div style="font-size:14px; color:#374151; font-style:italic; padding:8px 12px; background:#f9fafb; border-radius:4px;">"${thread.triggerContext}"</div>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#6b7280; margin-bottom:4px;">↪ DIVERTED TO</div>
          <div style="font-size:14px; color:#374151;">${thread.divertedPath}</div>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#6b7280; margin-bottom:4px;">📌 SIDELINED POINT</div>
          <div style="font-size:14px; color:#111827; font-weight:500;">${thread.originalPoint}</div>
        </div>
        <div style="padding:10px 14px; background:#f0f9ff; border-radius:6px; border:1px solid #bae6fd;">
          <span style="font-size:11px; font-weight:700; color:#0369a1;">SUGGESTED ACTION: </span>
          <span style="font-size:13px; color:#0c4a6e;">${thread.suggestedAction}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  const categoryBars = divergenceByCategory.map(cat => `
    <tr>
      <td style="padding:6px 0; font-size:13px; color:#374151; width:140px;">${cat.category}</td>
      <td style="padding:6px 0;">
        <div style="background:#f3f4f6; border-radius:4px; height:8px; width:200px;">
          <div style="background:#6366f1; border-radius:4px; height:8px; width:${cat.percentage * 2}px;"></div>
        </div>
      </td>
      <td style="padding:6px 0 6px 8px; font-size:13px; color:#6b7280;">${cat.percentage}%</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:680px; margin:0 auto; padding:32px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%); border-radius:12px 12px 0 0; padding:32px; text-align:center;">
      <div style="font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#a5b4fc; margin-bottom:8px;">LIBRARIAN AI · MEETING DIGEST</div>
      <h1 style="margin:0 0 8px; font-size:26px; color:#ffffff; font-family:'Georgia',serif;">${meetingTitle}</h1>
      <div style="font-size:14px; color:#c7d2fe;">${formattedDate}</div>
      ${participants.length ? `<div style="margin-top:12px; font-size:13px; color:#a5b4fc;">Participants: ${participants.join(', ')}</div>` : ''}
    </div>

    <!-- Stats bar -->
    <div style="background:#ffffff; padding:24px; display:flex; border:1px solid #e5e7eb; border-top:none;">
      <div style="flex:1; text-align:center; border-right:1px solid #e5e7eb;">
        <div style="font-size:32px; font-weight:700; color:#6366f1;">${divertedThreads.length}</div>
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#6b7280;">Diverted Threads</div>
      </div>
      <div style="flex:1; text-align:center; border-right:1px solid #e5e7eb;">
        <div style="font-size:32px; font-weight:700; color:#ef4444;">${criticalCount + highCount}</div>
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#6b7280;">Need Attention</div>
      </div>
      <div style="flex:1; text-align:center; border-right:1px solid #e5e7eb;">
        <div style="font-size:32px; font-weight:700; color:#f97316;">${pendingCount}</div>
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#6b7280;">Pending Action</div>
      </div>
      <div style="flex:1; text-align:center;">
        <div style="font-size:32px; font-weight:700; color:#0ea5e9;">${divergenceScore}%</div>
        <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#6b7280;">Divergence Rate</div>
      </div>
    </div>

    <!-- Summary -->
    <div style="background:#ffffff; padding:24px; border:1px solid #e5e7eb; border-top:none;">
      <h2 style="margin:0 0 12px; font-size:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#6b7280;">MEETING SUMMARY</h2>
      <p style="margin:0; font-size:15px; line-height:1.7; color:#374151;">${summary}</p>
    </div>

    <!-- AI Perspective -->
    <div style="background:#faf5ff; padding:24px; border:1px solid #e9d5ff; border-top:none;">
      <div style="display:flex; align-items:flex-start; gap:12px;">
        <div style="background:#7c3aed; color:white; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;">✦</div>
        <div>
          <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#7c3aed; margin-bottom:6px;">LIBRARIAN AI PERSPECTIVE</div>
          <p style="margin:0; font-size:14px; line-height:1.7; color:#4c1d95; font-style:italic;">"${aiPerspective}"</p>
        </div>
      </div>
    </div>

    <!-- Divergence heatmap -->
    ${divergenceByCategory.length ? `
    <div style="background:#ffffff; padding:24px; border:1px solid #e5e7eb; border-top:none;">
      <h2 style="margin:0 0 16px; font-size:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#6b7280;">DIVERGENCE BY CATEGORY</h2>
      <table style="border-collapse:collapse; width:100%;">${categoryBars}</table>
    </div>` : ''}

    <!-- Diverted Threads -->
    <div style="background:#f9fafb; padding:24px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px;">
      <h2 style="margin:0 0 20px; font-size:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#6b7280;">DIVERTED THREADS TO REVIEW</h2>
      ${threadsHTML}
    </div>

    <!-- Footer -->
    <div style="text-align:center; padding:24px; color:#9ca3af; font-size:12px;">
      <div>Generated by <strong>Librarian AI</strong> · Meeting Divergence Detector</div>
      <div style="margin-top:4px;">Review and triage these threads to keep your next meeting focused.</div>
    </div>
  </div>
</body>
</html>`;
}

async function sendDigestEmail(analysis, hostEmail) {
  const criticalCount = analysis.divertedThreads.filter(t => t.priority === 'critical').length;
  const subjectPrefix = criticalCount > 0 ? `🔴 [${criticalCount} Critical] ` : '';

  const mailOptions = {
    from: `"Librarian AI" <${process.env.EMAIL_USER}>`,
    to: hostEmail,
    subject: `${subjectPrefix}Meeting Digest: ${analysis.meetingTitle} — ${analysis.divertedThreads.length} Diverted Threads`,
    html: buildEmailHTML(analysis)
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendDigestEmail };
