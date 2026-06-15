/**
 * Score Calculator – uses weighted averages for all core scores
 */

/**
 * Calculates the overall skill score (0-100)
 */
function calculateSkillScore(profile) {
  const weights = {
    coding_skill: 0.20,
    communication_skill: 0.15,
    ai_knowledge: 0.15,
    problem_solving: 0.20,
    leadership: 0.10,
    creativity: 0.10,
    financial_discipline: 0.10,
  };

  let score = 0;
  for (const [key, weight] of Object.entries(weights)) {
    score += (Number(profile[key]) || 0) * weight;
  }

  return Math.round((score / 10) * 100); // convert 0-10 scale to 0-100
}

/**
 * Calculates consistency score (0-100)
 */
function calculateConsistencyScore(profile) {
  const codingHrs = Math.min(Number(profile.coding_hours) || 0, 8);
  const learningHrs = Math.min(Number(profile.learning_hours) || 0, 8);
  const socialMedia = Math.min(Number(profile.social_media_usage) || 0, 10);
  const consistency = Number(profile.consistency_level) || 5;

  const freqMap = { always: 10, often: 7.5, sometimes: 5, rarely: 2.5, never: 0 };
  const commPractice = freqMap[profile.communication_practice] || 5;
  const projFreq = freqMap[profile.project_frequency] || 5;
  const readingHabit = freqMap[profile.reading_habit] || 5;

  const positive = (codingHrs / 8) * 20 + (learningHrs / 8) * 20 + (commPractice / 10) * 15 +
    (projFreq / 10) * 20 + (readingHabit / 10) * 10 + (consistency / 10) * 15;

  const penalty = (socialMedia / 10) * 25;

  return Math.max(0, Math.min(100, Math.round(positive - penalty)));
}

/**
 * Calculates career readiness score (0-100)
 */
function calculateCareerReadinessScore(skillScore, consistencyScore, profile) {
  const comm = (Number(profile.communication_skill) || 5) / 10;
  const projFreqMap = { always: 1, often: 0.75, sometimes: 0.5, rarely: 0.25, never: 0 };
  const projFreq = projFreqMap[profile.project_frequency] || 0.5;
  const goalClarity = (profile.career_goal && profile.career_goal.length > 2) ? 1 : 0.5;

  const score = skillScore * 0.35 + consistencyScore * 0.30 + comm * 20 + projFreq * 10 + goalClarity * 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculates risk score (0-100 – higher = more risk)
 */
function calculateRiskScore(profile, consistencyScore) {
  let risk = 0;

  if (consistencyScore < 30) risk += 30;
  else if (consistencyScore < 50) risk += 15;

  const codingHrs = Number(profile.coding_hours) || 0;
  if (codingHrs < 0.5) risk += 20;
  else if (codingHrs < 1) risk += 10;

  const socialMedia = Number(profile.social_media_usage) || 0;
  if (socialMedia >= 7) risk += 20;
  else if (socialMedia >= 5) risk += 10;

  const comm = Number(profile.communication_skill) || 5;
  if (comm < 4) risk += 15;
  else if (comm < 6) risk += 7;

  const freqMap = { always: 0, often: 0, sometimes: 5, rarely: 10, never: 15 };
  risk += (freqMap[profile.project_frequency] || 5);

  const goalClarity = (profile.career_goal && profile.career_goal.length > 2) ? 0 : 10;
  risk += goalClarity;

  return Math.max(0, Math.min(100, Math.round(risk)));
}

module.exports = { calculateSkillScore, calculateConsistencyScore, calculateCareerReadinessScore, calculateRiskScore };
