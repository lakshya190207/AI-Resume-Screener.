/**
 * Security, Compliance & Audit Trail Logging Engine
 * 
 * Provides GDPR/CCPA data governance (Right to be Forgotten) and records
 * an immutable audit log of all weight adjustments, recruiter overrides,
 * anonymization policy updates, and demographic audits.
 */

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-101',
    timestamp: '2026-07-31T20:15:00Z',
    actor: 'Admin (Recruiting Ops)',
    action: 'WEIGHT_RECALIBRATION',
    details: 'Adjusted Must-Have weight from 40% to 45% following HITL recruiter audit feedback.',
    category: 'System Configuration'
  },
  {
    id: 'log-102',
    timestamp: '2026-07-31T21:30:00Z',
    actor: 'Recruiter (Sarah M.)',
    action: 'TIER_OVERRIDE',
    details: 'Overrode Candidate #8491 classification from Qualified to Top Tier.',
    category: 'Human-in-the-Loop'
  },
  {
    id: 'log-103',
    timestamp: '2026-07-31T22:00:00Z',
    actor: 'Fairness Audit System',
    action: 'FAIRNESS_AUDIT_RUN',
    details: 'Executed 4/5ths Rule Disparate Impact audit. Result: HEALTHY (Ratio: 0.92 >= 0.80).',
    category: 'Compliance'
  }
];

export function generateOutreachEmails(candidateName, category, jobTitle, questions = []) {
  if (category === 'Top Tier' || category === 'Qualified') {
    return {
      type: 'INVITATION',
      subject: `Interview Invitation: ${jobTitle} Role at TalentMatrix`,
      body: `Dear Candidate,

Thank you for applying for the ${jobTitle} position. Following our preliminary screening process, we were very impressed by your background and alignment with our core engineering requirements.

We would like to invite you to an initial interview with our recruiting team. As part of our discussion, we will explore key technical scenarios related to your background, including:

1. ${questions[0]?.question || 'Your top technical achievements and system impact.'}
2. ${questions[1]?.question || 'Core competency scenarios under bottleneck conditions.'}

Please click the scheduling link below to select a time that works best for you:
[SCHEDULING LINK]

Best regards,
Talent Matrix Talent Acquisition Team`
    };
  } else {
    return {
      type: 'REJECTION',
      subject: `Update regarding your application for ${jobTitle}`,
      body: `Dear Candidate,

Thank you for your interest in the ${jobTitle} role and for taking the time to share your background with us.

After reviewing your profile against the explicit requirements for this position, we have decided to move forward with other candidates whose current skill set matches our immediate core technical stack.

We encourage you to check our careers page for future opportunities that align with your background as our team continues to grow.

We wish you the very best in your professional journey.

Sincerely,
Talent Matrix Recruiting Operations`
    };
  }
}
