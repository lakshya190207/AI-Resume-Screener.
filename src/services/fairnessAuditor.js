/**
 * Demographic Bias & Fairness Audit Engine
 * 
 * Stores demographic metadata completely decoupled from the screening engine in an isolated vault.
 * Conducts statistical selection rate analysis (Disparate Impact / 4/5ths Rule) comparing total
 * applicant pool vs "Top Tier" candidate pool demographics.
 * Triggers automated alerts for manual review of scoring weights if significant disparity occurs.
 */

// Isolated demographic dataset (Never passed to or accessible by scoring logic)
export const ISOLATED_DEMOGRAPHIC_VAULT = [
  { candidateId: 'cand-01', gender: 'Female', ageGroup: '30-39', ethnicityGroup: 'Underrepresented Minority', category: 'Top Tier' },
  { candidateId: 'cand-02', gender: 'Male', ageGroup: '20-29', ethnicityGroup: 'Majority', category: 'Top Tier' },
  { candidateId: 'cand-03', gender: 'Female', ageGroup: '40-49', ethnicityGroup: 'Underrepresented Minority', category: 'Qualified' },
  { candidateId: 'cand-04', gender: 'Male', ageGroup: '30-39', ethnicityGroup: 'Majority', category: 'Top Tier' },
  { candidateId: 'cand-05', gender: 'Non-Binary', ageGroup: '20-29', ethnicityGroup: 'Underrepresented Minority', category: 'Top Tier' },
  { candidateId: 'cand-06', gender: 'Female', ageGroup: '50+', ethnicityGroup: 'Majority', category: 'Qualified' },
  { candidateId: 'cand-07', gender: 'Male', ageGroup: '20-29', ethnicityGroup: 'Majority', category: 'Not a Match' },
  { candidateId: 'cand-08', gender: 'Female', ageGroup: '30-39', ethnicityGroup: 'Underrepresented Minority', category: 'Not a Match' },
  { candidateId: 'cand-09', gender: 'Male', ageGroup: '40-49', ethnicityGroup: 'Majority', category: 'Qualified' },
  { candidateId: 'cand-10', gender: 'Female', ageGroup: '20-29', ethnicityGroup: 'Underrepresented Minority', category: 'Top Tier' },
  { candidateId: 'cand-11', gender: 'Male', ageGroup: '30-39', ethnicityGroup: 'Majority', category: 'Top Tier' },
  { candidateId: 'cand-12', gender: 'Female', ageGroup: '40-49', ethnicityGroup: 'Underrepresented Minority', category: 'Qualified' }
];

/**
 * Executes demographic fairness audit using Disparate Impact (80% / 4-5ths rule).
 * @param {Array<Object>} demographicData 
 * @returns {Object} Audit report with metrics, parity percentages, and alerts
 */
export function executeFairnessAudit(demographicData = ISOLATED_DEMOGRAPHIC_VAULT) {
  const totalPoolCount = demographicData.length;
  const topTierPool = demographicData.filter(d => d.category === 'Top Tier');
  const topTierCount = topTierPool.length;

  if (totalPoolCount === 0) {
    return {
      status: 'HEALTHY',
      disparateImpactRatio: 1.0,
      alerts: [],
      metrics: { gender: [], age: [], ethnicity: [] }
    };
  }

  // Helper to compute breakdown by attribute
  const computeBreakdown = (attribute) => {
    const totalByAttr = {};
    const topTierByAttr = {};

    demographicData.forEach(item => {
      const val = item[attribute] || 'Unstated';
      totalByAttr[val] = (totalByAttr[val] || 0) + 1;
      if (item.category === 'Top Tier') {
        topTierByAttr[val] = (topTierByAttr[val] || 0) + 1;
      }
    });

    return Object.keys(totalByAttr).map(key => {
      const totalAttrCount = totalByAttr[key];
      const topCount = topTierByAttr[key] || 0;
      const applicantShare = Math.round((totalAttrCount / totalPoolCount) * 100);
      const topTierShare = topTierCount > 0 ? Math.round((topCount / topTierCount) * 100) : 0;
      const selectionRate = Math.round((topCount / totalAttrCount) * 100);

      return {
        label: key,
        totalApplicantCount: totalAttrCount,
        topTierCount: topCount,
        applicantSharePercent: applicantShare,
        topTierSharePercent: topTierShare,
        selectionRatePercent: selectionRate
      };
    });
  };

  const genderBreakdown = computeBreakdown('gender');
  const ageBreakdown = computeBreakdown('ageGroup');
  const ethnicityBreakdown = computeBreakdown('ethnicityGroup');

  // Compute Disparate Impact Ratio for Gender (Highest selection rate vs lowest selection rate)
  const genderSelectionRates = genderBreakdown.map(g => g.selectionRatePercent);
  const maxGenderRate = Math.max(...genderSelectionRates, 1);
  const minGenderRate = Math.min(...genderSelectionRates);
  const disparateImpactRatio = Math.round((minGenderRate / maxGenderRate) * 100) / 100;

  const alerts = [];
  let auditStatus = 'HEALTHY';

  // 4/5ths Rule (80% Disparate Impact threshold)
  if (disparateImpactRatio < 0.80) {
    auditStatus = 'DISPARITY_ALERT';
    alerts.push({
      id: 'alert-gender-disparity',
      severity: 'HIGH',
      title: 'Demographic Disparity Flagged (Gender Parity Alert)',
      description: `The selection rate for protected demographic group (${minGenderRate}%) is lower than 80% of the highest selection group (${maxGenderRate}%). Disparate Impact Ratio: ${disparateImpactRatio}.`,
      action: 'Triggering mandatory recruiter manual review of active scoring weights. Check if Must-Have skill definitions act as non-essential proxies.'
    });
  } else {
    alerts.push({
      id: 'alert-healthy',
      severity: 'INFO',
      title: 'Fairness Parity Standards Satisfied',
      description: `Demographic selection rates across all groups fall within compliance boundaries (Disparate Impact Ratio: ${disparateImpactRatio} >= 0.80 threshold).`,
      action: 'No manual weight adjustment required.'
    });
  }

  return {
    status: auditStatus,
    disparateImpactRatio,
    totalApplicants: totalPoolCount,
    topTierApplicants: topTierCount,
    overallSelectionRate: Math.round((topTierCount / totalPoolCount) * 100),
    breakdowns: {
      gender: genderBreakdown,
      age: ageBreakdown,
      ethnicity: ethnicityBreakdown
    },
    alerts,
    lastAuditedAt: new Date().toISOString()
  };
}
