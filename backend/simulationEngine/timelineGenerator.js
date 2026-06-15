/**
 * Growth Projection Generator
 * Calculates expected growth at 3m, 6m, 1y, 3y, 5y milestones
 */

function generateGrowthProjection(skillScore, consistencyScore, riskScore, decisionText) {
  const decision = (decisionText || '').toLowerCase();

  // Base monthly growth rate from consistency (0.5% – 3% per month)
  const baseMonthlyGrowth = 0.5 + (consistencyScore / 100) * 2.5;
  const riskPenalty = (riskScore / 100) * 0.5;
  const monthlyGrowth = Math.max(0.2, baseMonthlyGrowth - riskPenalty);

  // Decision bonus
  let decisionBonus = 0;
  if (decision.includes('ai') || decision.includes('machine learning') || decision.includes('ml')) decisionBonus = 0.8;
  else if (decision.includes('coding') || decision.includes('code') || decision.includes('programming')) decisionBonus = 0.7;
  else if (decision.includes('communication')) decisionBonus = 0.5;
  else if (decision.includes('gate') || decision.includes('exam')) decisionBonus = 0.4;
  else if (decision.includes('freelanc')) decisionBonus = 0.6;
  else if (decision.includes('social media')) decisionBonus = -0.3;
  else decisionBonus = 0.3;

  function projectSkill(months) {
    const growth = (monthlyGrowth + decisionBonus) * months;
    const projected = skillScore + growth;
    return Math.max(0, Math.min(100, Math.round(projected)));
  }

  return {
    threeMonths: projectSkill(3),
    sixMonths: projectSkill(6),
    oneYear: projectSkill(12),
    threeYears: projectSkill(36),
    fiveYears: projectSkill(60),
  };
}

module.exports = { generateGrowthProjection };
