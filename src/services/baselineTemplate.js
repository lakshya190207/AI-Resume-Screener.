/**
 * Baseline Definition & Job Requisition Templates
 * 
 * Provides rigid explicit job templates to prevent arbitrary guessing
 * of candidate role requirements.
 */

export const INITIAL_JOB_REQUISITIONS = [
  {
    id: 'req-ai-eng',
    title: 'Senior AI & Systems Engineer',
    department: 'Artificial Intelligence & Core Infrastructure',
    level: 'Senior / Staff',
    minYearsExperience: 5,
    requiredEducation: "Bachelor's",
    mustHaveSkills: ['Python', 'PyTorch', 'System Architecture', 'REST API', 'Docker'],
    niceToHaveSkills: ['Kubernetes', 'TensorRT', 'LangChain', 'GraphQL', 'AWS'],
    defaultWeights: {
      mustHaves: 40,
      niceToHaves: 20,
      experience: 20,
      education: 10,
      trajectory: 10
    },
    description: 'Lead the design and deployment of scalable deep learning models and agentic workflow orchestration pipelines.'
  },
  {
    id: 'req-fullstack',
    title: 'Lead Full-Stack Architect',
    department: 'Platform Engineering',
    level: 'Lead',
    minYearsExperience: 6,
    requiredEducation: "Bachelor's",
    mustHaveSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'System Design'],
    niceToHaveSkills: ['GraphQL', 'Redis', 'Next.js', 'Tailwind CSS', 'CI/CD'],
    defaultWeights: {
      mustHaves: 45,
      niceToHaves: 15,
      experience: 25,
      education: 5,
      trajectory: 10
    },
    description: 'Drive high-throughput front-end and back-end web application architectures servicing enterprise real-time clients.'
  },
  {
    id: 'req-product-mkt',
    title: 'Senior Product Marketing Manager',
    department: 'Global Marketing',
    level: 'Senior',
    minYearsExperience: 4,
    requiredEducation: "Bachelor's",
    mustHaveSkills: ['Go-to-Market Strategy', 'Competitive Intelligence', 'Content Creation', 'Analytics'],
    niceToHaveSkills: ['HubSpot', 'SEO', 'Public Relations', 'Customer Interviewing'],
    defaultWeights: {
      mustHaves: 35,
      niceToHaves: 25,
      experience: 20,
      education: 10,
      trajectory: 10
    },
    description: 'Formulate and execute multi-channel GTM campaigns, product positioning, and sales enablement strategies.'
  }
];

export function validateJobTemplate(template) {
  const errors = [];
  if (!template.title || template.title.trim().length === 0) errors.push('Job title is required.');
  if (!template.mustHaveSkills || template.mustHaveSkills.length === 0) errors.push('At least 1 Must-Have skill is required.');
  if (typeof template.minYearsExperience !== 'number' || template.minYearsExperience < 0) errors.push('Valid minimum years of experience is required.');
  
  const sumWeights = Object.values(template.defaultWeights || {}).reduce((acc, curr) => acc + Number(curr || 0), 0);
  if (Math.abs(sumWeights - 100) > 0.1) {
    errors.push(`Weight distribution must sum to exactly 100% (Current sum: ${sumWeights}%).`);
  }

  return { isValid: errors.length === 0, errors };
}
