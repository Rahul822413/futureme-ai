/**
 * Risk Analyzer – identifies specific risk factors and recovery strategies
 */

function analyzeRisks(profile, riskScore) {
  const risks = [];
  const warnings = [];
  let recoveryPlan = [];

  const coding = Number(profile.coding_hours) || 0;
  const social = Number(profile.social_media_usage) || 0;
  const comm = Number(profile.communication_skill) || 5;
  const consistency = Number(profile.consistency_level) || 5;
  const freqMap = { always: 4, often: 3, sometimes: 2, rarely: 1, never: 0 };
  const projFreq = freqMap[profile.project_frequency] || 1;

  if (coding < 1) {
    risks.push('Very low coding practice (< 1 hour/day)');
    warnings.push('Skill atrophy risk – technical skills may stagnate');
    recoveryPlan.push('Commit to at least 1 hour of hands-on coding daily');
  }

  if (social >= 5) {
    risks.push('High social media usage reducing productive time');
    warnings.push('Attention fragmentation, reduced deep-work capacity');
    recoveryPlan.push('Limit social media to 30 mins/day using app timers');
  }

  if (comm < 5) {
    risks.push('Below-average communication skills');
    warnings.push('May affect interviews, team collaboration, and leadership opportunities');
    recoveryPlan.push('Join a public-speaking group or take an online communication course');
  }

  if (consistency < 5) {
    risks.push('Low consistency level self-reported');
    warnings.push('Irregular effort leads to slow growth and missed milestones');
    recoveryPlan.push('Use habit-tracking apps; build streaks with 21-day challenges');
  }

  if (projFreq < 2) {
    risks.push('Low project-building frequency');
    warnings.push('Portfolio gaps will hurt job applications and internship prospects');
    recoveryPlan.push('Build at least one end-to-end project every 2 months');
  }

  const level = riskScore >= 60 ? 'High' : riskScore >= 35 ? 'Medium' : 'Low';

  if (recoveryPlan.length === 0) {
    recoveryPlan = ['Maintain current habits', 'Continuously challenge yourself with harder problems', 'Mentor others to solidify knowledge'];
  }

  return { risks, warnings, recoveryPlan, riskLevel: level };
}

module.exports = { analyzeRisks };
