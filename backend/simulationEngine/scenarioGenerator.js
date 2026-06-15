/**
 * Scenario Generator – produces Optimistic, Realistic, and Risk scenarios
 */

function generateScenarios(profile, skillScore, consistencyScore, careerReadinessScore, riskScore, growthProjection, decisionText) {
  const decision = (decisionText || '').toLowerCase();
  const careerGoal = profile.career_goal || 'Software Engineer';
  const field = profile.field || 'Computer Science';

  // ----- Decision-aware context -----
  const isAI = decision.includes('ai') || decision.includes('ml') || decision.includes('machine learning');
  const isCoding = decision.includes('coding') || decision.includes('code') || decision.includes('programming');
  const isComm = decision.includes('communication');
  const isGATE = decision.includes('gate');
  const isFreelance = decision.includes('freelanc');
  const isSocialMedia = decision.includes('social media');
  const isStartup = decision.includes('startup');

  // --- OPTIMISTIC SCENARIO ---
  let optimistic = {
    title: 'Optimistic Future',
    summary: '',
    careerPath: '',
    opportunities: [],
    requiredActions: [],
    growthEstimate: `+${growthProjection.oneYear - skillScore}% skill growth in 1 year`,
    timeframe: '1–2 years',
    probability: `${Math.max(30, 70 - riskScore)}%`,
  };

  if (isAI) {
    optimistic.summary = `With consistent AI learning and ${profile.coding_hours || 2}h/day practice, you could become a competitive AI/ML practitioner. Your profile suggests strong problem-solving (${profile.problem_solving}/10) which is a key asset.`;
    optimistic.careerPath = 'Junior AI Engineer → ML Engineer → AI Research Scientist';
    optimistic.opportunities = ['AI internship at tech startups', 'Open-source ML contributions', 'Kaggle competition placements', 'Research publication opportunities', 'Freelance AI project work'];
    optimistic.requiredActions = ['Complete a structured ML course (Fast.ai / Andrew Ng)', 'Build 3+ AI projects on GitHub', 'Participate in 2 Kaggle competitions', 'Deploy at least one model to production', 'Network with AI community on LinkedIn'];
  } else if (isCoding) {
    optimistic.summary = `Spending ${profile.coding_hours || 2}h/day on structured coding practice could significantly accelerate your software development career. Your skill score of ${skillScore}/100 shows solid foundation.`;
    optimistic.careerPath = 'Junior Developer → Mid-Level Engineer → Senior Engineer / Tech Lead';
    optimistic.opportunities = ['Software internships at product companies', 'Open-source contributor status', 'Freelance project income', 'Hackathon wins', 'Early startup equity opportunities'];
    optimistic.requiredActions = ['Master one primary language (Python / JavaScript)', 'Build a portfolio of 5+ projects', 'Contribute to open-source projects', 'Solve 100+ DSA problems', 'Deploy full-stack applications'];
  } else if (isComm) {
    optimistic.summary = `Strong communication skills paired with your technical background can transform your career trajectory. Communication is the #1 differentiator for senior roles.`;
    optimistic.careerPath = 'Individual Contributor → Team Lead → Product Manager / Engineering Manager';
    optimistic.opportunities = ['Leadership roles in projects', 'Conference speaking opportunities', 'Mentoring and training roles', 'Client-facing positions', 'Cross-functional team leadership'];
    optimistic.requiredActions = ['Join Toastmasters or a public speaking club', 'Present projects to audiences monthly', 'Write technical articles/blogs', 'Lead group discussions in college/office', 'Participate in group interviews and GDs'];
  } else if (isGATE) {
    optimistic.summary = `Consistent GATE preparation could unlock prestigious IIT/NIT/PSU opportunities. Your academic discipline will also strengthen your fundamentals significantly.`;
    optimistic.careerPath = 'M.Tech at IIT/NIT → Research Scholar / PSU Engineer → Senior Researcher / Professor';
    optimistic.opportunities = ['IIT M.Tech admission', 'PSU recruitment (BHEL, ONGC, ISRO)', 'Research fellowships', 'PhD opportunities abroad', 'Academic teaching positions'];
    optimistic.requiredActions = ['Complete standard textbooks for all subjects', 'Solve 10 years of GATE previous papers', 'Join a test series', 'Maintain a revision schedule', 'Target rank < 1000'];
  } else if (isFreelance) {
    optimistic.summary = `Freelancing can provide financial independence while accelerating your practical skill development. With your current skill level, you could reach 6-figure annual freelance income within 2 years.`;
    optimistic.careerPath = 'Beginner Freelancer → Established Freelancer → Agency Owner / Product Creator';
    optimistic.opportunities = ['Upwork / Fiverr / Toptal income', 'International client portfolio', 'Remote work opportunities', 'Product/SaaS revenue', 'Consulting and training income'];
    optimistic.requiredActions = ['Create a strong portfolio website', 'Get first 3 clients through referrals', 'Specialize in a niche (AI, Web, Mobile)', 'Set up professional billing/contracts', 'Collect testimonials aggressively'];
  } else {
    optimistic.summary = `Your decision to "${decisionText}" shows initiative. With consistent effort and your current skill base of ${skillScore}/100, you can achieve significant growth.`;
    optimistic.careerPath = `${careerGoal} → Senior ${careerGoal} → Domain Expert`;
    optimistic.opportunities = ['Career advancement in chosen field', 'Skill differentiation from peers', 'Networking opportunities', 'Portfolio enhancement', 'Higher salary potential'];
    optimistic.requiredActions = ['Break the decision into 30-day goals', 'Find an accountability partner', 'Track progress weekly', 'Seek mentorship', 'Document your learning journey publicly'];
  }

  // --- REALISTIC SCENARIO ---
  const realisticGrowth = Math.round((growthProjection.oneYear - skillScore) * 0.6);
  let realistic = {
    title: 'Realistic Future',
    summary: '',
    expectedProgress: '',
    strengths: [],
    weakAreas: [],
    actionPlan: [],
    growthEstimate: `+${realisticGrowth}% skill growth in 1 year`,
    probability: `${Math.min(80, 50 + (consistencyScore / 2))}%`,
  };

  realistic.strengths = [];
  if (Number(profile.problem_solving) >= 7) realistic.strengths.push('Strong problem-solving ability');
  if (Number(profile.coding_skill) >= 7) realistic.strengths.push('Good coding foundation');
  if (Number(profile.communication_skill) >= 7) realistic.strengths.push('Effective communicator');
  if (Number(profile.ai_knowledge) >= 6) realistic.strengths.push('Solid AI/ML awareness');
  if (Number(profile.creativity) >= 7) realistic.strengths.push('Creative thinking');
  if (realistic.strengths.length === 0) realistic.strengths.push('Willingness to learn and improve');

  realistic.weakAreas = [];
  if (Number(profile.coding_skill) < 5) realistic.weakAreas.push('Coding skills need improvement');
  if (Number(profile.communication_skill) < 5) realistic.weakAreas.push('Communication skills below average');
  if (Number(profile.financial_discipline) < 5) realistic.weakAreas.push('Financial planning needs attention');
  if (Number(profile.leadership) < 5) realistic.weakAreas.push('Leadership experience is limited');
  if (realistic.weakAreas.length === 0) realistic.weakAreas.push('Maintaining consistency over the long term');

  if (isAI) {
    realistic.summary = `In a realistic scenario, you will progress from beginner to intermediate AI level within 1 year if you maintain ${profile.coding_hours || 2}h/day practice. Expect to build 2–3 small projects.`;
    realistic.expectedProgress = 'Beginner → Intermediate AI practitioner, capable of implementing standard ML algorithms';
    realistic.actionPlan = ['Learn Python and scientific libraries (NumPy, Pandas)', 'Complete 1 full ML course', 'Build 2 end-to-end projects', 'Participate in 1 competition', 'Start a technical blog'];
  } else if (isCoding) {
    realistic.summary = `With consistent daily coding, you\'ll move from your current level to a comfortable intermediate skill set. Expect improved problem-solving speed and confidence.`;
    realistic.expectedProgress = 'Improved DSA skills, ability to build complete applications, better job interview performance';
    realistic.actionPlan = ['Follow a structured DSA curriculum', 'Build 3 real-world projects', 'Practice on LeetCode/HackerRank', 'Review fundamentals weekly', 'Contribute to a small open-source project'];
  } else if (isGATE) {
    realistic.summary = `With regular study, you will strengthen your core CS fundamentals significantly. A rank under 3000 is achievable with consistent effort.`;
    realistic.expectedProgress = 'Stronger OS, DBMS, Networks, Algorithms fundamentals; improved exam temperament';
    realistic.actionPlan = ['Study 4–6 hours daily', 'Cover all standard subjects methodically', 'Take full mock tests monthly', 'Analyze weak subjects', 'Join online GATE community'];
  } else {
    realistic.summary = `A realistic outcome of this decision involves measurable progress within 6–12 months, assuming you stay consistent with your current habits.`;
    realistic.expectedProgress = `${realisticGrowth}% skill improvement, better portfolio, stronger profile for ${careerGoal} roles`;
    realistic.actionPlan = ['Set clear weekly milestones', 'Review progress every 2 weeks', 'Adjust strategy based on results', 'Seek feedback from peers/mentors', 'Stay focused on one goal at a time'];
  }

  // --- RISK SCENARIO ---
  let risk = {
    title: 'Risk Future',
    summary: '',
    possibleDelays: [],
    skillGaps: [],
    missedOpportunities: [],
    riskLevel: riskScore >= 60 ? 'High' : riskScore >= 35 ? 'Medium' : 'Low',
    recoveryStrategy: [],
  };

  risk.possibleDelays = ['Goal achievement delayed by 1–2 years if inconsistency continues', 'Slower interview readiness if practice is irregular'];

  risk.skillGaps = [];
  if (Number(profile.coding_skill) < 6) risk.skillGaps.push('Coding not interview-ready');
  if (Number(profile.communication_skill) < 6) risk.skillGaps.push('Poor communication limiting opportunities');
  if (Number(profile.ai_knowledge) < 4) risk.skillGaps.push('AI knowledge gap in an AI-driven job market');
  if (risk.skillGaps.length === 0) risk.skillGaps.push('Risk of skills becoming outdated without continued learning');

  risk.missedOpportunities = [];
  if (Number(profile.social_media_usage) >= 5) risk.missedOpportunities.push('Productive hours lost to social media daily');
  risk.missedOpportunities.push('Competitive peers who stay consistent will advance faster');
  if (isCoding || isAI) risk.missedOpportunities.push('Without projects, recruiters cannot verify your skills');

  if (isSocialMedia) {
    risk.summary = `If you continue high social media usage without action, your growth will stagnate. ${profile.social_media_usage || 3}h/day of social media = ${Math.round((profile.social_media_usage || 3) * 365)} hours per year of potentially lost productive time.`;
    risk.recoveryStrategy = ['Use app usage restrictions (Digital Wellbeing/ScreenTime)', 'Replace social media time with one skill activity', 'Take a 7-day social media detox to reset', 'Track your productive hours with a journal'];
  } else {
    risk.summary = `If effort is inconsistent or the decision is not followed through, you may spend time and energy without achieving meaningful results, and fall behind peers.`;
    risk.recoveryStrategy = ['Start with a 21-day consistency challenge', 'Find an accountability partner or mentor', 'Break big goals into daily micro-tasks', 'Review and adapt your plan every 2 weeks', 'Celebrate small wins to maintain motivation'];
  }

  return { optimistic, realistic, risk };
}

module.exports = { generateScenarios };
