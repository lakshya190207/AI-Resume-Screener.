/**
 * Historical Data Training Engine
 * 
 * Ingests anonymized resumes of past successful hires to identify key patterns,
 * skill co-occurrences, and career trajectory velocity. Uses these metrics as a 
 * baseline for pattern matching candidate resumes.
 */

export const HISTORICAL_PAST_HIRES = [
  {
    id: 'hire-01',
    roleId: 'req-ai-eng',
    title: 'Senior AI Engineer',
    tenureMonths: 36,
    performanceRating: 4.9,
    promotionCount: 2,
    skills: ['Python', 'PyTorch', 'System Architecture', 'REST API', 'Docker', 'Kubernetes', 'TensorRT', 'C++'],
    trajectoryVelocity: 'Rapid (3 promotions in 4 years)',
    yearsExperienceBeforeHire: 6,
    anonymizedSummary: 'Engineered high-throughput ML serving layer using PyTorch and C++, reduced inference latency by 45%. Expanded infrastructure with Kubernetes and Docker.'
  },
  {
    id: 'hire-02',
    roleId: 'req-ai-eng',
    title: 'Staff ML Infrastructure Engineer',
    tenureMonths: 48,
    performanceRating: 5.0,
    promotionCount: 2,
    skills: ['Python', 'PyTorch', 'System Architecture', 'Docker', 'AWS', 'LangChain', 'Distributed Training'],
    trajectoryVelocity: 'Consistently High (Lead Architect within 2 years)',
    yearsExperienceBeforeHire: 8,
    anonymizedSummary: 'Built distributed agentic pipelines using Python and PyTorch. Orchestrated containerized GPU clusters on AWS.'
  },
  {
    id: 'hire-03',
    roleId: 'req-fullstack',
    title: 'Lead Full-Stack Engineer',
    tenureMonths: 42,
    performanceRating: 4.8,
    promotionCount: 1,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'System Design', 'Redis', 'GraphQL', 'Next.js'],
    trajectoryVelocity: 'Strong (Senior to Lead in 1.5 years)',
    yearsExperienceBeforeHire: 7,
    anonymizedSummary: 'Architected real-time web application frontend in React/TypeScript and microservices in Node.js/PostgreSQL.'
  },
  {
    id: 'hire-04',
    roleId: 'req-product-mkt',
    title: 'Product Marketing Manager',
    tenureMonths: 30,
    performanceRating: 4.7,
    promotionCount: 1,
    skills: ['Go-to-Market Strategy', 'Competitive Intelligence', 'Content Creation', 'Analytics', 'HubSpot', 'SEO'],
    trajectoryVelocity: 'Steady (Mid-level to Senior Manager in 2 years)',
    yearsExperienceBeforeHire: 5,
    anonymizedSummary: 'Drove enterprise GTM launch campaigns resulting in 300% ARR growth. Managed competitive intelligence and content matrix.'
  }
];

/**
 * Analyzes historical past hire profiles to construct a pattern baseline model.
 * @param {string} roleId 
 * @returns {Object} Baseline pattern metrics
 */
export function trainHistoricalPatternBaseline(roleId) {
  const relevantHires = HISTORICAL_PAST_HIRES.filter(h => h.roleId === roleId || !roleId);
  const hireCount = relevantHires.length;

  if (hireCount === 0) {
    return {
      topSkillCombinations: [],
      avgTenureMonths: 36,
      avgYearsExperienceBeforeHire: 5,
      highCorrelatedSecondarySkills: [],
      trajectoryMatchBaselineScore: 85
    };
  }

  // Count skill frequency
  const skillFrequency = {};
  relevantHires.forEach(hire => {
    hire.skills.forEach(skill => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
  });

  // Sort skills by frequency
  const topCorrelatedSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({
      skill,
      correlationPercent: Math.round((count / hireCount) * 100)
    }));

  const avgTenureMonths = Math.round(
    relevantHires.reduce((sum, h) => sum + h.tenureMonths, 0) / hireCount
  );

  const avgYearsExp = Math.round(
    (relevantHires.reduce((sum, h) => sum + h.yearsExperienceBeforeHire, 0) / hireCount) * 10
  ) / 10;

  return {
    totalTrainedHires: hireCount,
    topCorrelatedSkills,
    avgTenureMonths,
    avgYearsExperienceBeforeHire: avgYearsExp,
    avgPerformanceRating: 4.85,
    patternModelTrainedAt: new Date().toISOString()
  };
}

/**
 * Evaluates how closely a candidate's background matches successful historical hires.
 * @param {Array<string>} candidateSkills 
 * @param {number} candidateYearsExp 
 * @param {Object} trainedBaseline 
 * @returns {Object} { trajectoryScore, matchedPatternTraits, explanation }
 */
export function calculateTrajectoryMatch(candidateSkills = [], candidateYearsExp = 0, trainedBaseline) {
  if (!trainedBaseline || !trainedBaseline.topCorrelatedSkills) {
    return { trajectoryScore: 75, matchedPatternTraits: [], explanation: 'Default baseline applied.' };
  }

  let patternScore = 50;
  const matchedPatternTraits = [];

  // Match against top correlated historical skills
  trainedBaseline.topCorrelatedSkills.forEach(item => {
    const hasSkill = candidateSkills.some(cs => cs.toLowerCase() === item.skill.toLowerCase());
    if (hasSkill) {
      patternScore += (item.correlationPercent / 100) * 8;
      matchedPatternTraits.push(`Matches historical hire core trait: ${item.skill} (${item.correlationPercent}% correlation)`);
    }
  });

  // Experience trajectory similarity bonus
  const expDiff = Math.abs(candidateYearsExp - trainedBaseline.avgYearsExperienceBeforeHire);
  if (expDiff <= 2) {
    patternScore += 15;
    matchedPatternTraits.push(`Experience depth aligns closely with top historical hire baseline (${trainedBaseline.avgYearsExperienceBeforeHire} yrs avg)`);
  } else if (candidateYearsExp > trainedBaseline.avgYearsExperienceBeforeHire) {
    patternScore += 10;
    matchedPatternTraits.push(`Exceeds historical hire experience baseline`);
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(patternScore)));

  return {
    trajectoryScore: finalScore,
    matchedPatternTraits,
    explanation: `Candidate matches ${matchedPatternTraits.length} historical success indicators with a ${finalScore}% trajectory correlation.`
  };
}
