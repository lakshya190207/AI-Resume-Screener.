/**
 * Human-in-the-Loop (HITL) Feedback Engine
 * 
 * Routes a configurable sample percentage (e.g. 25%) of agent decisions to human recruiters.
 * Collects recruiter ratings and tier overrides, and uses feedback trend data to automatically 
 * compute optimized scoring weight recalibrations.
 */

export const INITIAL_HITL_CONFIG = {
  samplePercentage: 25, // 25% of candidate evaluations routed for recruiter audit
  autoRecalibrateThreshold: 5, // recalibrate suggestion generated after 5 reviews
};

export const SAMPLE_HITL_REVIEWS = [
  {
    id: 'review-101',
    candidateId: 'cand-01',
    candidateAlias: 'Candidate #8491',
    jobId: 'req-ai-eng',
    jobTitle: 'Senior AI & Systems Engineer',
    agentCategory: 'Qualified',
    agentScore: 78,
    recruiterAction: 'Override -> Top Tier',
    recruiterRating: 5,
    recruiterNotes: 'Candidate missing 1 nice-to-have, but PyTorch + System Architecture depth is exceptional. Must-have weight should be higher.',
    timestamp: '2026-07-31T14:20:00Z',
    feedbackFlags: { boostMustHaves: true, lowerEducationWeight: false }
  },
  {
    id: 'review-102',
    candidateId: 'cand-02',
    candidateAlias: 'Candidate #3920',
    jobId: 'req-ai-eng',
    jobTitle: 'Senior AI & Systems Engineer',
    agentCategory: 'Top Tier',
    agentScore: 84,
    recruiterAction: 'Approved',
    recruiterRating: 5,
    recruiterNotes: 'Spot-on evaluation. Excellent match for our core stack.',
    timestamp: '2026-07-31T15:10:00Z',
    feedbackFlags: { boostMustHaves: false, lowerEducationWeight: false }
  },
  {
    id: 'review-103',
    candidateId: 'cand-03',
    candidateAlias: 'Candidate #7712',
    jobId: 'req-ai-eng',
    jobTitle: 'Senior AI & Systems Engineer',
    agentCategory: 'Qualified',
    agentScore: 68,
    recruiterAction: 'Override -> Not a Match',
    recruiterRating: 2,
    recruiterNotes: 'Education score bumped this candidate up, but they lacked Python experience. Boost must-haves, reduce education weight.',
    timestamp: '2026-07-31T16:45:00Z',
    feedbackFlags: { boostMustHaves: true, lowerEducationWeight: true }
  }
];

/**
 * Computes weight recalibration suggestions based on recruiter feedback logs.
 * @param {Array<Object>} reviews 
 * @param {Object} currentWeights 
 * @returns {Object} Recalibration output
 */
export function calculateWeightRecalibration(reviews = [], currentWeights) {
  if (!reviews || reviews.length === 0 || !currentWeights) {
    return { hasSuggestion: false, recommendedWeights: currentWeights, rationale: [] };
  }

  let mustHaveBoostCount = 0;
  let lowerEduCount = 0;
  let boostExpCount = 0;
  let overrideCount = 0;

  reviews.forEach(r => {
    if (r.recruiterAction.includes('Override')) overrideCount++;
    if (r.feedbackFlags?.boostMustHaves) mustHaveBoostCount++;
    if (r.feedbackFlags?.lowerEducationWeight) lowerEduCount++;
    if (r.feedbackFlags?.boostExperience) boostExpCount++;
  });

  const total = reviews.length;
  const rationale = [];

  const newWeights = { ...currentWeights };

  if (mustHaveBoostCount / total >= 0.3) {
    newWeights.mustHaves = Math.min(60, newWeights.mustHaves + 5);
    rationale.push(`Recruiters prioritized core Must-Have skills in ${mustHaveBoostCount}/${total} audits. Recommended +5% increase in Must-Have weight.`);
  }

  if (lowerEduCount / total >= 0.3) {
    newWeights.education = Math.max(5, newWeights.education - 5);
    rationale.push(`Recruiters noted Education degree level was overweighted in ${lowerEduCount}/${total} audits. Recommended -5% decrease in Education weight.`);
  }

  // Ensure total weights sum to 100%
  const sum = Object.values(newWeights).reduce((a, b) => a + b, 0);
  if (sum !== 100) {
    const diff = 100 - sum;
    newWeights.niceToHaves = Math.max(5, newWeights.niceToHaves + diff);
  }

  return {
    hasSuggestion: rationale.length > 0,
    overrideRate: Math.round((overrideCount / total) * 100),
    totalAudits: total,
    recommendedWeights: newWeights,
    rationale
  };
}
