function generateScenarios(profile, skillScore, consistencyScore, careerReadinessScore, riskScore, growthProjection, decisionText) {
  const decision = (decisionText || '').toLowerCase();
  const careerGoal = profile.career_goal || 'Professional';
  const field = profile.field || 'General';

  // Detect Domain
  const combined = `${field} ${careerGoal}`.toLowerCase();
  let domain = 'general';
  if (combined.includes('medic') || combined.includes('health') || combined.includes('doctor') || combined.includes('nurs') || combined.includes('surgery')) domain = 'medicine';
  else if (combined.includes('business') || combined.includes('finance') || combined.includes('mba') || combined.includes('market') || combined.includes('manage')) domain = 'business';
  else if (combined.includes('art') || combined.includes('design') || combined.includes('ui/ux') || combined.includes('animat')) domain = 'design';
  else if (combined.includes('law') || combined.includes('legal') || combined.includes('attorney')) domain = 'law';
  else if (combined.includes('teach') || combined.includes('educat') || combined.includes('professor')) domain = 'education';
  else if (combined.includes('computer') || combined.includes('software') || combined.includes('it') || combined.includes('tech') || combined.includes('ai') || combined.includes('engineer')) domain = 'tech';

  // Specific triggers
  const isComm = decision.includes('communication');
  const isFreelance = decision.includes('freelanc');
  const isSocialMedia = decision.includes('social media');

  // Domain Jargon Mapping
  const jargon = {
    medicine: {
      action: 'clinical practice and studying',
      path: `Medical Student → Resident → ${careerGoal}`,
      opps: ['Prestigious residency match', 'Research publications', 'Clinical fellowships', 'Chief resident role', 'Private practice opportunities'],
      actions: ['Complete USMLE/NEET PG with top percentiles', 'Publish 2+ clinical case studies', 'Complete 3 elective rotations', 'Master patient communication', 'Maintain high study consistency'],
      weakness: 'Clinical knowledge gaps',
      missing: 'Without clinical hours, you cannot match into competitive specialties'
    },
    business: {
      action: 'strategic networking and market analysis',
      path: `Analyst → Manager → ${careerGoal}`,
      opps: ['Top-tier MBA admission', 'Executive leadership roles', 'Venture capital funding', 'High-impact consulting projects', 'Global market expansion'],
      actions: ['Lead a major cross-functional project', 'Expand professional network by 500+', 'Complete a financial modeling certification', 'Publish industry analysis', 'Pitch to investors or board members'],
      weakness: 'Lack of strategic vision or network',
      missing: 'Without a strong network, career progression slows down'
    },
    design: {
      action: 'portfolio building and creative exploration',
      path: `Junior Designer → Senior Designer → ${careerGoal}`,
      opps: ['Lead designer roles at top agencies', 'Viral Behance/Dribbble projects', 'High-paying freelance clients', 'Design awards', 'Art direction opportunities'],
      actions: ['Publish 10 high-quality portfolio pieces', 'Master industry-standard tools (Figma/Adobe)', 'Participate in design challenges', 'Network with art directors', 'Learn basic front-end development'],
      weakness: 'Portfolio lacks depth or modern trends',
      missing: 'Without a strong portfolio, clients/employers cannot gauge your talent'
    },
    law: {
      action: 'case study and legal reasoning practice',
      path: `Law Student → Associate → ${careerGoal}`,
      opps: ['Top-tier corporate firm placement', 'Clerkship with a renowned judge', 'High-profile litigation cases', 'Partner track acceleration', 'Legal consulting'],
      actions: ['Achieve top percentile in Bar/entrance exams', 'Participate in national moot courts', 'Publish in law reviews', 'Secure summer clerkships', 'Master legal drafting'],
      weakness: 'Weak legal drafting or argumentation',
      missing: 'Without strong internships and moot court experience, firm placements are difficult'
    },
    education: {
      action: 'lesson preparation and pedagogical study',
      path: `Teacher → Senior Educator → ${careerGoal}`,
      opps: ['Principal/Admin roles', 'EdTech course creation', 'Curriculum design leadership', 'Tenured professorship', 'Educational consulting'],
      actions: ['Complete advanced pedagogy certifications', 'Develop a comprehensive digital curriculum', 'Publish educational research', 'Master student psychology', 'Adopt modern EdTech tools'],
      weakness: 'Outdated teaching methodologies',
      missing: 'Without adopting modern EdTech, you may struggle to engage future students'
    },
    tech: {
      action: 'structured coding and system design practice',
      path: `Junior Developer → Senior Engineer → ${careerGoal}`,
      opps: ['Software internships at FAANG/Product companies', 'Open-source contributor status', 'Freelance project income', 'Hackathon wins', 'Early startup equity'],
      actions: ['Master one primary language (Python / JS)', 'Build a portfolio of 5+ projects', 'Contribute to open-source', 'Solve 100+ DSA problems', 'Deploy full-stack applications'],
      weakness: 'Coding skills not interview-ready',
      missing: 'Without projects, recruiters cannot verify your technical skills'
    },
    general: {
      action: 'consistent practice and upskilling',
      path: `Beginner → Professional → ${careerGoal}`,
      opps: ['Career advancement in chosen field', 'Skill differentiation from peers', 'Networking opportunities', 'Portfolio enhancement', 'Higher salary potential'],
      actions: ['Break the decision into 30-day goals', 'Find an accountability partner', 'Track progress weekly', 'Seek mentorship', 'Document your learning journey publicly'],
      weakness: 'Core domain skills need improvement',
      missing: 'Without tangible proof of skill, career growth will stagnate'
    }
  };

  const domainData = jargon[domain];

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

  if (isComm) {
    optimistic.summary = `Strong communication skills paired with your background in ${field} can transform your career trajectory. Communication is the #1 differentiator for senior roles.`;
    optimistic.careerPath = `Individual Contributor → Team Lead → ${careerGoal}`;
    optimistic.opportunities = ['Leadership roles in projects', 'Conference speaking opportunities', 'Mentoring and training roles', 'Client-facing positions'];
    optimistic.requiredActions = ['Join Toastmasters or a public speaking club', 'Present projects to audiences monthly', 'Write technical/industry articles', 'Lead group discussions'];
  } else if (isFreelance) {
    optimistic.summary = `Freelancing in ${field} can provide financial independence while accelerating your practical skill development. You could reach top-tier freelance income within 2 years.`;
    optimistic.careerPath = `Beginner Freelancer → Established Freelancer → Agency Owner`;
    optimistic.opportunities = ['Upwork/Fiverr high-ticket clients', 'International client portfolio', 'Remote work opportunities', 'Consulting and training income'];
    optimistic.requiredActions = ['Create a strong portfolio website', 'Get first 3 clients through referrals', 'Specialize in a niche', 'Collect testimonials aggressively'];
  } else {
    optimistic.summary = `Spending ${profile.coding_hours || 2}h/day on ${domainData.action} could significantly accelerate your career in ${field}. Your skill score of ${skillScore}/100 shows a solid foundation.`;
    optimistic.careerPath = domainData.path;
    optimistic.opportunities = domainData.opps;
    optimistic.requiredActions = domainData.actions;
  }

  // --- REALISTIC SCENARIO ---
  const realisticGrowth = Math.round((growthProjection.oneYear - skillScore) * 0.6);
  let realistic = {
    title: 'Realistic Future',
    summary: `With consistent daily effort, you\'ll move from your current level to a comfortable intermediate skill set in ${field}. Expect improved confidence and execution speed.`,
    expectedProgress: `Improved fundamentals, ability to execute complete tasks, better job interview performance for ${careerGoal} roles.`,
    strengths: [],
    weakAreas: [],
    actionPlan: domainData.actions.slice(0, 4).map(a => `Start: ${a}`),
    growthEstimate: `+${realisticGrowth}% skill growth in 1 year`,
    probability: `${Math.min(80, 50 + (consistencyScore / 2))}%`,
  };

  if (Number(profile.problem_solving) >= 7) realistic.strengths.push('Strong problem-solving ability');
  if (Number(profile.coding_skill) >= 7) realistic.strengths.push('Good domain foundation');
  if (Number(profile.communication_skill) >= 7) realistic.strengths.push('Effective communicator');
  if (Number(profile.ai_knowledge) >= 6) realistic.strengths.push('Solid industry awareness');
  if (Number(profile.creativity) >= 7) realistic.strengths.push('Creative thinking');
  if (realistic.strengths.length === 0) realistic.strengths.push('Willingness to learn and improve');

  if (Number(profile.coding_skill) < 5) realistic.weakAreas.push('Core domain skills need improvement');
  if (Number(profile.communication_skill) < 5) realistic.weakAreas.push('Communication skills below average');
  if (Number(profile.financial_discipline) < 5) realistic.weakAreas.push('Financial planning needs attention');
  if (Number(profile.leadership) < 5) realistic.weakAreas.push('Leadership experience is limited');
  if (realistic.weakAreas.length === 0) realistic.weakAreas.push('Maintaining consistency over the long term');

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

  if (Number(profile.coding_skill) < 6) risk.skillGaps.push(domainData.weakness);
  if (Number(profile.communication_skill) < 6) risk.skillGaps.push('Poor communication limiting opportunities');
  if (Number(profile.ai_knowledge) < 4) risk.skillGaps.push('Industry knowledge gap in a rapidly changing market');
  if (risk.skillGaps.length === 0) risk.skillGaps.push('Risk of skills becoming outdated without continued learning');

  if (Number(profile.social_media_usage) >= 5) risk.missedOpportunities.push('Productive hours lost to social media daily');
  risk.missedOpportunities.push('Competitive peers who stay consistent will advance faster');
  risk.missedOpportunities.push(domainData.missing);

  if (isSocialMedia) {
    risk.summary = `If you continue high social media usage without action, your growth will stagnate. ${profile.social_media_usage || 3}h/day of social media = ${Math.round((profile.social_media_usage || 3) * 365)} hours per year of potentially lost productive time.`;
    risk.recoveryStrategy = ['Use app usage restrictions', 'Replace social media time with one skill activity', 'Take a 7-day social media detox to reset'];
  } else {
    risk.summary = `If effort is inconsistent or the decision is not followed through, you may spend time and energy without achieving meaningful results in ${field}, falling behind peers.`;
    risk.recoveryStrategy = ['Start with a 21-day consistency challenge', 'Find an accountability partner or mentor', 'Break big goals into daily micro-tasks', 'Review and adapt your plan every 2 weeks'];
  }

  return { optimistic, realistic, risk };
}

module.exports = { generateScenarios };
