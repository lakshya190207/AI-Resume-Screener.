/**
 * Weighted Scoring & Categorization Engine
 * 
 * Performs strict requirement matching against Must-Have and Nice-to-Have criteria,
 * calculates a dynamic 0-100 score based on admin-configurable weights,
 * and categorizes candidates into Top Tier, Qualified, or Not a Match.
 */

import { calculateTrajectoryMatch, trainHistoricalPatternBaseline } from './historicalTrainer';

/**
 * Extracts skills, years of experience, and degree level from anonymized resume text.
 * @param {string} anonymizedText 
 * @param {Object} jobReq Optional active job requisition to dynamically include custom skills
 * @returns {Object} Extracted features
 */
export function extractCandidateFeatures(anonymizedText, jobReq = null) {
  if (!anonymizedText || typeof anonymizedText !== 'string') {
    return { skills: [], yearsExperience: 0, education: "Bachelor's" };
  }

  const textLower = anonymizedText.toLowerCase();

  // Known skill repository to search within resume
  const DEFAULT_KNOWN_SKILLS = [
    'Python', 'PyTorch', 'TensorFlow', 'System Architecture', 'REST API', 'Docker',
    'Kubernetes', 'TensorRT', 'LangChain', 'GraphQL', 'AWS', 'C++', 'Java',
    'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'System Design', 'Redis',
    'Next.js', 'Tailwind CSS', 'CI/CD', 'Go-to-Market Strategy', 'Competitive Intelligence',
    'Content Creation', 'Analytics', 'HubSpot', 'SEO', 'Public Relations', 'Customer Interviewing',
    'SQL', 'Git', 'Linux', 'Microservices', 'Agile', 'Jira', 'Figma', 'Wireframing', 'User Research'
  ];

  // Dynamically append any custom must-haves or nice-to-haves from jobReq
  const customSkills = [];
  if (jobReq) {
    if (jobReq.mustHaveSkills) customSkills.push(...jobReq.mustHaveSkills);
    if (jobReq.niceToHaveSkills) customSkills.push(...jobReq.niceToHaveSkills);
  }

  const allSkillsToSearch = Array.from(new Set([...DEFAULT_KNOWN_SKILLS, ...customSkills]));

  const extractedSkills = allSkillsToSearch.filter(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(textLower);
  });

  // Extract years of experience using regex patterns
  let yearsExp = 3; // default fallback if unstated
  const expMatch = textLower.match(/(\d+)\+?\s*(?:years|yrs)\s*(?:of)?\s*(?:experience|exp|in)/i) ||
                   textLower.match(/experience\s*:?\s*(\d+)\+?\s*(?:years|yrs)/i);
  if (expMatch) {
    yearsExp = parseInt(expMatch[1], 10);
  } else {
    // Estimate based on number of distinct job roles mentioned
    const jobRoleMatches = (textLower.match(/\b(engineer|developer|manager|lead|architect|analyst|specialist|consultant|designer)\b/gi) || []).length;
    if (jobRoleMatches >= 4) yearsExp = 7;
    else if (jobRoleMatches >= 2) yearsExp = 4;
  }

  // Extract education level
  let education = "Bachelor's";
  if (/\b(ph\.?d|doctorate)\b/i.test(textLower)) {
    education = "Ph.D.";
  } else if (/\b(master|m\.?s\.?|m\.?a\.?|m\.?b\.?a\.?)\b/i.test(textLower)) {
    education = "Master's";
  } else if (/\b(bachelor|b\.?s\.?|b\.?a\.?)\b/i.test(textLower)) {
    education = "Bachelor's";
  }

  return {
    skills: extractedSkills,
    yearsExperience: yearsExp,
    education: education
  };
}

/**
 * Scores candidate resume against job requirements and weights.
 * 
 * @param {string} anonymizedText 
 * @param {Object} jobReq 
 * @param {Object} customWeights 
 * @returns {Object} Full evaluation report
 */
export function scoreCandidateResume(anonymizedText, jobReq, customWeights = null) {
  const candidate = extractCandidateFeatures(anonymizedText, jobReq);
  const weights = customWeights || jobReq?.defaultWeights || {
    mustHaves: 40,
    niceToHaves: 20,
    experience: 20,
    education: 10,
    trajectory: 10
  };

  // 1. Must-Have Skill Matching
  const mustHaves = jobReq?.mustHaveSkills || [];
  const matchedMustHaves = mustHaves.filter(mSkill => 
    candidate.skills.some(cSkill => cSkill.toLowerCase() === mSkill.toLowerCase())
  );
  const missingMustHaves = mustHaves.filter(mSkill => 
    !candidate.skills.some(cSkill => cSkill.toLowerCase() === mSkill.toLowerCase())
  );
  const mustHaveCoveragePercent = mustHaves.length > 0 ? (matchedMustHaves.length / mustHaves.length) * 100 : 100;
  const mustHaveScore = Math.round(mustHaveCoveragePercent);

  // 2. Nice-To-Have Skill Matching
  const niceToHaves = jobReq?.niceToHaveSkills || [];
  const matchedNiceToHaves = niceToHaves.filter(nSkill => 
    candidate.skills.some(cSkill => cSkill.toLowerCase() === nSkill.toLowerCase())
  );
  const missingNiceToHaves = niceToHaves.filter(nSkill => 
    !candidate.skills.some(cSkill => cSkill.toLowerCase() === nSkill.toLowerCase())
  );
  const niceToHaveCoveragePercent = niceToHaves.length > 0 ? (matchedNiceToHaves.length / niceToHaves.length) * 100 : 100;
  const niceToHaveScore = Math.round(niceToHaveCoveragePercent);

  // 3. Experience Depth Score
  const minReqExp = jobReq?.minYearsExperience || 0;
  let experienceScore = 100;
  if (candidate.yearsExperience < minReqExp) {
    const diff = minReqExp - candidate.yearsExperience;
    experienceScore = Math.max(0, 100 - (diff * 25));
  } else {
    // Small bonus for exceeding experience without being overqualified
    const bonus = Math.min(15, (candidate.yearsExperience - minReqExp) * 3);
    experienceScore = Math.min(100, 85 + bonus);
  }

  // 4. Education Score
  const eduHierarchy = { "High School": 1, "Associate": 2, "Bachelor's": 3, "Master's": 4, "Ph.D.": 5 };
  const candidateEduVal = eduHierarchy[candidate.education] || 3;
  const reqEduVal = eduHierarchy[jobReq?.requiredEducation] || 3;
  let educationScore = candidateEduVal >= reqEduVal ? 100 : 50;

  // 5. Historical Trajectory Pattern Score
  const historicalBaseline = trainHistoricalPatternBaseline(jobReq?.id);
  const trajectoryResult = calculateTrajectoryMatch(candidate.skills, candidate.yearsExperience, historicalBaseline);
  const trajectoryScore = trajectoryResult.trajectoryScore;

  // 6. Weighted Score Calculation (0-100)
  const weightedScore = Math.round(
    (mustHaveScore * (weights.mustHaves / 100)) +
    (niceToHaveScore * (weights.niceToHaves / 100)) +
    (experienceScore * (weights.experience / 100)) +
    (educationScore * (weights.education / 100)) +
    (trajectoryScore * (weights.trajectory / 100))
  );

  // 7. Categorization Rules
  // Top Tier: Score >= 80 and 100% must-haves met
  // Qualified: Score >= 60 and missing at most 1 must-have
  // Not a Match: Score < 60 or missing > 1 must-have
  let category = 'Not a Match';
  let categoryColor = 'red';
  let categoryReason = '';

  if (weightedScore >= 80 && missingMustHaves.length === 0) {
    category = 'Top Tier';
    categoryColor = 'emerald';
    categoryReason = 'Exceeds target overall threshold (≥80%) and satisfies 100% of Must-Have requirements.';
  } else if (weightedScore >= 60 && missingMustHaves.length <= 1) {
    category = 'Qualified';
    categoryColor = 'amber';
    categoryReason = missingMustHaves.length === 1 
      ? `Meets overall score threshold (${weightedScore}%), but has a minor gap in 1 must-have skill (${missingMustHaves[0]}).`
      : `Meets overall qualification threshold (${weightedScore}%).`;
  } else {
    category = 'Not a Match';
    categoryColor = 'red';
    categoryReason = missingMustHaves.length > 1
      ? `Fails critical requirements: Missing ${missingMustHaves.length} Must-Have skills (${missingMustHaves.join(', ')}).`
      : `Overall evaluation score (${weightedScore}%) falls below qualified threshold (60%).`;
  }

  return {
    candidateFeatures: candidate,
    scores: {
      overall: weightedScore,
      mustHaves: mustHaveScore,
      niceToHaves: niceToHaveScore,
      experience: experienceScore,
      education: educationScore,
      trajectory: trajectoryScore
    },
    skillMatch: {
      matchedMustHaves,
      missingMustHaves,
      matchedNiceToHaves,
      missingNiceToHaves,
      mustHaveCoveragePercent,
      niceToHaveCoveragePercent
    },
    category,
    categoryColor,
    categoryReason,
    trajectoryAnalysis: trajectoryResult,
    appliedWeights: weights,
    evaluatedAt: new Date().toISOString()
  };
}
