/**
 * Recommendation Generator
 * Produces personalized recommendations based on profile + decision
 */

function generateRecommendations(profile, skillScore, consistencyScore, riskScore, decisionText) {
  const decision = (decisionText || '').toLowerCase();
  const isAI = decision.includes('ai') || decision.includes('ml') || decision.includes('machine learning');
  const isCoding = decision.includes('coding') || decision.includes('code') || decision.includes('programming');
  const isComm = decision.includes('communication');
  const isGATE = decision.includes('gate');
  const isFreelance = decision.includes('freelanc');

  // --- Skills to Learn ---
  let skills = ['Data Structures and Algorithms', 'Git & Version Control', 'System Design Fundamentals'];
  if (isAI) skills = ['Python for Data Science', 'Machine Learning (scikit-learn)', 'Deep Learning (TensorFlow/PyTorch)', 'Data Analysis (Pandas, NumPy)', 'Model Deployment (Flask/FastAPI)', ...skills];
  else if (isCoding) skills = ['Advanced DSA', 'Full-Stack Web Development', 'Database Design (SQL + NoSQL)', 'REST API Design', 'Testing and CI/CD', ...skills];
  else if (isComm) skills = ['Public Speaking', 'Technical Writing', 'Active Listening', 'Presentation Design', 'Negotiation Skills', ...skills];
  else if (isGATE) skills = ['Operating Systems', 'Computer Networks', 'Database Management Systems', 'Algorithms & Theory of Computation', 'Digital Logic & Computer Organization', ...skills];
  else if (isFreelance) skills = ['Project Management', 'Client Communication', 'Contract & Pricing Strategy', 'Portfolio Development', 'Digital Marketing Basics', ...skills];

  // --- Courses ---
  let courses = [];
  if (isAI) courses = ['Machine Learning by Andrew Ng (Coursera)', 'Fast.ai Practical Deep Learning', 'CS229 Stanford (YouTube)', 'Kaggle Learn Micro-courses', 'Deep Learning Specialization (Coursera)'];
  else if (isCoding) courses = ['The Odin Project (free, full-stack)', 'CS50 Harvard (free)', 'NeetCode 150 DSA course', 'Full-Stack Open (University of Helsinki)', 'The Complete Web Developer Bootcamp (Udemy)'];
  else if (isComm) courses = ['Successful Presentation (Coursera – University of Colorado)', 'English for Career Development (Coursera)', 'Communication Skills for Engineers (LinkedIn Learning)', 'Technical Writing (Google on Coursera)'];
  else if (isGATE) courses = ['NPTEL CS courses (free)', 'Gate Smashers YouTube', 'Made Easy / ACE Institute materials', 'Previous year GATE papers (GateOverflow)', 'Apni Kaksha / Love Babbar for CS fundamentals'];
  else courses = ['Google Digital Skills courses (free)', 'MIT OpenCourseWare (free)', 'edX Professional Certificates', 'LinkedIn Learning Paths', 'YouTube structured playlists for your niche'];

  // --- Projects ---
  let projects = [];
  if (isAI) projects = ['Movie Recommendation System (collaborative filtering)', 'Fake News Detector (NLP + BERT)', 'Image Classifier using CNN', 'Stock Price Predictor (LSTM)', 'Personal AI Chatbot (fine-tuned LLM)'];
  else if (isCoding) projects = ['Full-stack To-Do App with authentication', 'E-commerce website with payment integration', 'Real-time Chat App (WebSockets)', 'URL Shortener with analytics', 'Portfolio website with animated UI'];
  else if (isFreelance) projects = ['Client portfolio website', 'Freelance project tracker app', 'Invoice generator tool', 'niche SaaS MVP (one problem, one solution)', 'Automation scripts for local businesses'];
  else if (isGATE) projects = ['OS Simulator (process scheduling algorithms)', 'Mini DBMS from scratch', 'Network packet analyzer', 'Compiler design project', 'OS kernel module in C'];
  else projects = ['Personal portfolio website', 'Productivity tracker app', 'API integration project', 'Open-source contribution', 'Documentation for an existing tool'];

  // --- Habits ---
  const habits = [];
  if (Number(profile.coding_hours) < 2) habits.push('Increase daily coding to at least 2 hours');
  if (Number(profile.social_media_usage) >= 4) habits.push('Limit social media to 30 mins/day');
  if (profile.project_frequency === 'rarely' || profile.project_frequency === 'never') habits.push('Build one project every 6–8 weeks');
  habits.push('Read one technical article daily (Medium, dev.to, ArXiv)');
  habits.push('Write a weekly learning journal');
  habits.push('Practice leetcode/coding problems for 30 mins daily');
  habits.push('Review what you learned at the end of each day (spaced repetition)');

  // --- Weekly Plan ---
  const weeklyPlan = [
    'Monday: 2h skill learning + 30min DSA',
    'Tuesday: 2h project work + 30min reading',
    'Wednesday: 2h skill learning + 30min communication practice',
    'Thursday: 2h project work + 30min review',
    'Friday: 2h learning + 30min portfolio update',
    'Saturday: 4h project sprint + networking (LinkedIn)',
    'Sunday: Weekly review + plan next week goals',
  ];

  // --- Mistakes to avoid ---
  const mistakesToAvoid = [
    'Tutorial hell – watching videos without building anything',
    'Multitasking between too many technologies at once',
    'Comparing your progress to others instead of your past self',
    'Neglecting soft skills and communication practice',
    'Not building a GitHub/portfolio to showcase work',
    'Skipping fundamentals and jumping to advanced topics',
    'Not seeking feedback on your projects and code',
  ];

  // --- Career Paths ---
  const careerPaths = [];
  if (isAI) careerPaths.push('AI/ML Engineer', 'Data Scientist', 'NLP Engineer', 'Computer Vision Engineer', 'AI Research Scientist');
  else if (isCoding) careerPaths.push('Full-Stack Developer', 'Backend Engineer', 'Frontend Engineer', 'DevOps Engineer', 'Software Architect');
  else if (isFreelance) careerPaths.push('Independent Consultant', 'Agency Founder', 'SaaS Entrepreneur', 'Technical Writer', 'Online Course Creator');
  else careerPaths.push('Software Engineer', 'Product Manager', 'Technical Lead', 'Solutions Architect', 'Engineering Manager');

  return { skills, courses, projects, habits, weeklyPlan, mistakesToAvoid, careerPaths };
}

module.exports = { generateRecommendations };
