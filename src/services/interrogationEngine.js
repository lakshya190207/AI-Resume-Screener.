/**
 * Dynamic Interrogation Engine
 * 
 * Generates 3-5 custom interview questions tailored specifically to the candidate's 
 * verified background, targeting top achievements, testing core skills, and probing potential gaps.
 */

/**
 * Generates dynamic, background-tailored interview questions for a candidate evaluation.
 * @param {Object} evaluation Result from scoreCandidateResume
 * @param {Object} jobReq Active Job Requisition
 * @returns {Array<Object>} List of 3 to 5 tailored interview questions
 */
export function generateInterrogationQuestions(evaluation, jobReq) {
  if (!evaluation || !jobReq) return [];

  const questions = [];
  const { candidateFeatures, skillMatch, scores, category } = evaluation;
  const { matchedMustHaves, missingMustHaves, matchedNiceToHaves } = skillMatch;

  // 1. Target Top Verified Achievement
  if (matchedMustHaves.length > 0) {
    const primarySkill = matchedMustHaves[0];
    const secondarySkill = matchedMustHaves[1] || matchedNiceToHaves[0] || 'System Architecture';
    questions.push({
      id: 'q-achievement',
      type: 'Achievement Deep Dive',
      badgeColor: 'sky',
      question: `In your background, you demonstrated proficiency with ${primarySkill} and ${secondarySkill}. Can you walk us through a complex production project where you combined these skills, focusing on the quantitative performance impact achieved?`,
      intent: 'Verifies depth of claimed core technical accomplishments and validates impact metrics.'
    });
  }

  // 2. Test Core Competency (Scenario-Based)
  const coreSkillToTest = matchedMustHaves.length > 1 ? matchedMustHaves[1] : (jobReq.mustHaveSkills[0] || 'Core Engineering');
  questions.push({
    id: 'q-competency',
    type: 'Core Competency Scenario',
    badgeColor: 'indigo',
    question: `For the ${jobReq.title} role, scaling ${coreSkillToTest} under bottleneck conditions is crucial. Describe how you would troubleshoot and resolve a sudden performance degradation or reliability failure in a system built with ${coreSkillToTest}.`,
    intent: 'Tests real-world problem-solving, architectural decision-making, and failure recovery under pressure.'
  });

  // 3. Probe Potential Skill Gaps / Missing Requirements
  if (missingMustHaves.length > 0) {
    const missingSkill = missingMustHaves[0];
    questions.push({
      id: 'q-gap-musthave',
      type: 'Requirement Gap Probe',
      badgeColor: 'rose',
      question: `Our core requirements specify hands-on experience with ${missingSkill}. While your resume shows strong experience in adjacent areas, how quickly could you ramp up on ${missingSkill}, and what transferable patterns from your past tech stack apply here?`,
      intent: `Directly assesses adaptability and learning velocity regarding missing must-have skill (${missingSkill}).`
    });
  } else if (matchedNiceToHaves.length < jobReq.niceToHaveSkills.length) {
    const missingNice = jobReq.niceToHaveSkills.find(s => !matchedNiceToHaves.includes(s)) || 'Secondary Tools';
    questions.push({
      id: 'q-gap-nicehave',
      type: 'Nice-to-Have Expansion',
      badgeColor: 'amber',
      question: `Have you had occasion to work with or integrate ${missingNice} in your past environments? If not, how would you approach integrating it into our stack?`,
      intent: `Explores breadth across secondary requirements (${missingNice}).`
    });
  }

  // 4. Experience & Scale Probe
  if (candidateFeatures.yearsExperience < jobReq.minYearsExperience) {
    questions.push({
      id: 'q-exp-velocity',
      type: 'Career Acceleration Probe',
      badgeColor: 'purple',
      question: `This role targets candidates with ${jobReq.minYearsExperience}+ years of experience. With your ${candidateFeatures.yearsExperience} years, what specific high-ownership responsibilities have accelerated your growth to operate at a senior level?`,
      intent: 'Evaluates if high performance velocity offsets fewer raw years of calendar experience.'
    });
  } else {
    questions.push({
      id: 'q-system-scale',
      type: 'System Scale & Trade-offs',
      badgeColor: 'emerald',
      question: `Reflecting on your ${candidateFeatures.yearsExperience} years of experience, what is the largest trade-off you had to make between delivery speed and technical debt when architecting a solution? How did that decision play out long term?`,
      intent: 'Measures engineering maturity, foresight, and management of technical debt.'
    });
  }

  // 5. Category-Specific Tactical Question
  if (category === 'Top Tier') {
    questions.push({
      id: 'q-top-leadership',
      type: 'Technical Leadership & Mentorship',
      badgeColor: 'emerald',
      question: `As a Top-Tier match for this position, how do you approach setting technical standards, mentoring junior engineers, and driving cross-functional alignment across product teams?`,
      intent: 'Assesses leadership multiplier potential for high-scoring candidates.'
    });
  } else if (category === 'Qualified') {
    questions.push({
      id: 'q-qualified-edge',
      type: 'Differentiating Factor',
      badgeColor: 'amber',
      question: `What is one unique perspective or skill set not explicitly captured in the job description that you feel gives you an edge in this role?`,
      intent: 'Gives qualified candidates an opportunity to showcase secret superpower skills.'
    });
  } else {
    questions.push({
      id: 'q-pivot-clarity',
      type: 'Alignment & Ambition',
      badgeColor: 'blue',
      question: `What specific aspects of this role aligned most strongly with your personal career trajectory and motivated you to apply?`,
      intent: 'Gauges candidate motivation and alignment.'
    });
  }

  return questions;
}
