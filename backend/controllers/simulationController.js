const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { calculateSkillScore, calculateConsistencyScore, calculateCareerReadinessScore, calculateRiskScore } = require('../simulationEngine/scoreCalculator');
const { generateGrowthProjection } = require('../simulationEngine/timelineGenerator');
const { generateScenarios } = require('../simulationEngine/scenarioGenerator');
const { generateRecommendations } = require('../simulationEngine/recommendationGenerator');
const { analyzeRisks } = require('../simulationEngine/riskAnalyzer');
const { generateNarratives } = require('../simulationEngine/llmService');

const generateSimulation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { decisionText, profile: bodyProfile } = req.body;
    if (!decisionText) return res.status(400).json({ success: false, message: 'Decision text is required' });

    // Retrieve stored profile if exists
    let storedProfile = await db.get('SELECT * FROM profiles WHERE user_id = ?', userId);
    // Use bodyProfile if provided, overriding stored profile
    const profile = bodyProfile ? { ...storedProfile, ...bodyProfile } : storedProfile;
    if (!profile) return res.status(400).json({ success: false, message: 'Please complete your profile first' });

    // Normalize profile fields (convert camelCase to snake_case expected by simulation engine)
    const normalizeProfile = (p) => {
      const mapping = {
        codingHours: 'coding_hours',
        learningHours: 'learning_hours',
        socialMediaUsage: 'social_media_usage',
        projectFrequency: 'project_frequency',
        consistencyLevel: 'consistency_level',
        communicationSkill: 'communication_skill',
        aiKnowledge: 'ai_knowledge',
        problemSolving: 'problem_solving',
        codingSkill: 'coding_skill',
        leadership: 'leadership',
        creativity: 'creativity',
        financialDiscipline: 'financial_discipline',
      };
      const norm = { ...p };
      for (const [camel, snake] of Object.entries(mapping)) {
        if (p[camel] !== undefined) norm[snake] = p[camel];
      }
      return norm;
    };
    const normalizedProfile = normalizeProfile(profile);

    // Compute scores
    const skillScore = calculateSkillScore(normalizedProfile);
    const consistencyScore = calculateConsistencyScore(normalizedProfile);
    const careerReadinessScore = calculateCareerReadinessScore(skillScore, consistencyScore, normalizedProfile);
    const riskScore = calculateRiskScore(normalizedProfile, consistencyScore);

    // Generate outputs
    const growthProjection = generateGrowthProjection(skillScore, consistencyScore, riskScore, decisionText);
    const { optimistic, realistic, risk } = generateScenarios(normalizedProfile, skillScore, consistencyScore, careerReadinessScore, riskScore, growthProjection, decisionText);
    // Generate scenario-specific recommendations
    const optimisticRec = generateRecommendations(normalizedProfile, skillScore, consistencyScore, riskScore, decisionText + ' optimistic');
    const realisticRec = generateRecommendations(normalizedProfile, skillScore, consistencyScore, riskScore, decisionText + ' realistic');
    const riskRec = generateRecommendations(normalizedProfile, skillScore, consistencyScore, riskScore, decisionText + ' risk');
    optimistic.recommendations = optimisticRec;
    realistic.recommendations = realisticRec;
    risk.recommendations = riskRec;
    
    const narratives = await generateNarratives(normalizedProfile, decisionText, optimistic, realistic, risk);
    optimistic.narrative = narratives.optimisticNarrative;
    realistic.narrative = narratives.realisticNarrative;
    risk.narrative = narratives.riskNarrative;
    
    const recommendations = generateRecommendations(normalizedProfile, skillScore, consistencyScore, riskScore, decisionText);
    const riskAnalysis = analyzeRisks(normalizedProfile, riskScore);

    // Build timeline
    const timeline = [
      { period: '3 Months', skillLevel: growthProjection.threeMonths, focus: 'Foundation building', action: recommendations.habits[0] || 'Build daily learning habits' },
      { period: '6 Months', skillLevel: growthProjection.sixMonths, focus: 'First projects', action: recommendations.projects[0] || 'Complete first major project' },
      { period: '1 Year', skillLevel: growthProjection.oneYear, focus: 'Intermediate level', action: recommendations.courses[0] || 'Complete a structured course' },
      { period: '3 Years', skillLevel: growthProjection.threeYears, focus: 'Advanced skills', action: recommendations.careerPaths[0] || 'Apply for senior opportunities' },
      { period: '5 Years', skillLevel: growthProjection.fiveYears, focus: 'Domain expertise', action: recommendations.careerPaths[1] || 'Lead projects and mentor others' },
    ];

    // Save to DB
    const id = uuidv4();
    await db.run(`INSERT INTO simulations (id,user_id,decision_text,skill_score,consistency_score,career_readiness_score,risk_score,
      growth_projection,optimistic_scenario,realistic_scenario,risk_scenario,timeline,recommendations)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      id, userId, decisionText, skillScore, consistencyScore, careerReadinessScore, riskScore,
      JSON.stringify(growthProjection), JSON.stringify(optimistic), JSON.stringify(realistic),
      JSON.stringify({ ...risk, ...riskAnalysis }), JSON.stringify(timeline), JSON.stringify(recommendations));

    const simulation = await db.get('SELECT * FROM simulations WHERE id = ?', id);
    const parsed = parseSimulation(simulation);
    res.status(201).json({ success: true, simulation: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const parseSimulation = (sim) => {
  if (!sim) return null;
  return {
    ...sim,
    growth_projection: tryParse(sim.growth_projection),
    optimistic_scenario: tryParse(sim.optimistic_scenario),
    realistic_scenario: tryParse(sim.realistic_scenario),
    risk_scenario: tryParse(sim.risk_scenario),
    timeline: tryParse(sim.timeline),
    recommendations: tryParse(sim.recommendations),
  };
};

const tryParse = (str) => { try { return JSON.parse(str); } catch { return str; } };

const getHistory = async (req, res) => {
  try {
    const sims = await db.all('SELECT * FROM simulations WHERE user_id = ? ORDER BY created_at DESC', req.params.userId);
    res.json({ success: true, simulations: sims.map(parseSimulation) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSimulation = async (req, res) => {
  try {
    const sim = await db.get('SELECT * FROM simulations WHERE id = ?', req.params.id);
    if (!sim) return res.status(404).json({ success: false, message: 'Simulation not found' });
    res.json({ success: true, simulation: parseSimulation(sim) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteSimulation = async (req, res) => {
  try {
    await db.run('DELETE FROM simulations WHERE id = ? AND user_id = ?', req.params.id, req.user.id);
    res.json({ success: true, message: 'Simulation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const compareSimulations = async (req, res) => {
  try {
    const { decisionA, decisionB, profile: bodyProfile } = req.body;
    const userId = req.user.id;
    let profile = await db.get('SELECT * FROM profiles WHERE user_id = ?', userId) || bodyProfile;
    if (!profile) return res.status(400).json({ success: false, message: 'Profile required for comparison' });

    const skillScore = calculateSkillScore(profile);
    const consistencyScore = calculateConsistencyScore(profile);
    const riskScore = calculateRiskScore(profile, consistencyScore);

    const projA = generateGrowthProjection(skillScore, consistencyScore, riskScore, decisionA);
    const projB = generateGrowthProjection(skillScore, consistencyScore, riskScore, decisionB);
    const recA = generateRecommendations(profile, skillScore, consistencyScore, riskScore, decisionA);
    const recB = generateRecommendations(profile, skillScore, consistencyScore, riskScore, decisionB);

    const recommended = projA.fiveYears >= projB.fiveYears ? 'A' : 'B';

    res.json({
      success: true,
      comparison: {
        decisionA: { text: decisionA, growth: projA, topSkills: recA.skills.slice(0, 3), careerPaths: recA.careerPaths.slice(0, 3) },
        decisionB: { text: decisionB, growth: projB, topSkills: recB.skills.slice(0, 3), careerPaths: recB.careerPaths.slice(0, 3) },
        recommended,
        reasoning: recommended === 'A'
          ? `"${decisionA}" shows higher 5-year growth potential (+${projA.fiveYears - skillScore}% vs +${projB.fiveYears - skillScore}%)`
          : `"${decisionB}" shows higher 5-year growth potential (+${projB.fiveYears - skillScore}% vs +${projA.fiveYears - skillScore}%)`,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { generateSimulation, getHistory, getSimulation, deleteSimulation, compareSimulations };
