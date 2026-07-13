function generateRecommendations(profile, skillScore, consistencyScore, riskScore, decisionText) {
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

  const domainData = {
    medicine: {
      skills: ['Patient Communication', 'Clinical Diagnostics', 'Medical Research & Statistics', 'Healthcare Ethics', 'Advanced Anatomy/Physiology'],
      courses: ['USMLE/NEET PG Prep Materials', 'Clinical Case Studies (BMJ)', 'Advanced Life Support (ALS)', 'Global Health (Coursera)', 'Medical Ethics Seminars'],
      projects: ['Clinical Case Report Publication', 'Medical Outreach Volunteer', 'Healthcare Data Analysis', 'Hospital Elective Rotation', 'Shadowing a Specialist'],
      careerPaths: ['Attending Physician', 'Surgical Specialist', 'Medical Researcher', 'Healthcare Administrator', 'Chief Medical Officer']
    },
    business: {
      skills: ['Financial Modeling', 'Strategic Management', 'Data-Driven Decision Making', 'Negotiation', 'Market Analysis'],
      courses: ['MBA Prep Courses', 'Financial Markets (Yale/Coursera)', 'Business Strategy (HBS Online)', 'Data Analytics for Business', 'Marketing Psychology'],
      projects: ['Startup Business Plan', 'Industry Market Research Report', 'Financial Portfolio Analysis', 'Consulting Case Competitions', 'E-commerce Store Launch'],
      careerPaths: ['Management Consultant', 'Investment Banker', 'Product Manager', 'Startup Founder', 'C-Suite Executive (CEO/CFO)']
    },
    design: {
      skills: ['User Interface (UI) Design', 'User Experience (UX) Research', 'Typography & Color Theory', 'Prototyping (Figma/Adobe)', 'Design Thinking'],
      courses: ['Google UX Design Certificate', 'Interaction Design Foundation', 'Advanced Figma Masterclass', 'Color Psychology', '3D Modeling Basics'],
      projects: ['Full App Redesign Case Study', 'Daily UI Challenge (100 days)', 'Personal Branding Portfolio', 'Open-source Design System', 'Freelance Branding Project'],
      careerPaths: ['UX/UI Designer', 'Art Director', 'Product Designer', 'Creative Director', 'Brand Strategist']
    },
    law: {
      skills: ['Legal Drafting', 'Contract Negotiation', 'Argumentation & Logic', 'Case Law Research', 'Client Counseling'],
      courses: ['LSAT/Bar Exam Prep', 'Corporate Law Foundations', 'Intellectual Property Law', 'Legal Writing Seminars', 'International Human Rights'],
      projects: ['Moot Court Competitions', 'Legal Research Paper Publication', 'Law Clinic Pro-bono Work', 'Summer Clerkship', 'Legal Tech Startups Analysis'],
      careerPaths: ['Corporate Lawyer', 'Litigator', 'In-House Counsel', 'Judge / Magistrate', 'Legal Consultant']
    },
    education: {
      skills: ['Instructional Design', 'Student Psychology', 'Public Speaking', 'Curriculum Development', 'Educational Technology (EdTech)'],
      courses: ['Advanced Pedagogy', 'Child/Adult Psychology', 'E-Learning Design', 'Special Education Needs (SEN)', 'Classroom Management'],
      projects: ['Online Course Creation', 'Interactive Lesson Plan Development', 'Educational YouTube Channel', 'Student Mentorship Program', 'Research in Learning Methodologies'],
      careerPaths: ['School Principal', 'University Professor', 'EdTech Founder', 'Curriculum Developer', 'Corporate Trainer']
    },
    tech: {
      skills: ['Data Structures and Algorithms', 'System Design', 'Cloud Computing (AWS/GCP)', 'Version Control (Git)', 'CI/CD & Testing'],
      courses: ['Machine Learning by Andrew Ng', 'The Odin Project (Full-stack)', 'NeetCode 150 DSA', 'CS50 Harvard', 'AWS Certified Solutions Architect'],
      projects: ['Full-stack SaaS application', 'AI Chatbot integration', 'Open-source code contribution', 'Microservices architecture clone', 'High-traffic load testing simulation'],
      careerPaths: ['Senior Software Engineer', 'AI/ML Engineer', 'Software Architect', 'Engineering Manager', 'CTO']
    },
    general: {
      skills: ['Effective Communication', 'Project Management', 'Data Literacy', 'Time Management', 'Critical Thinking'],
      courses: ['Project Management Professional (PMP)', 'Data Analysis Fundamentals', 'Leadership Psychology', 'Effective Communication', 'Strategic Thinking'],
      projects: ['Industry Research Project', 'Cross-functional Team Leadership', 'Personal Portfolio/Blog', 'Process Optimization Initiative', 'Public Speaking Engagement'],
      careerPaths: [`Senior ${careerGoal}`, `Lead ${careerGoal}`, 'Consultant', 'Department Head', 'Director']
    }
  };

  const data = domainData[domain];

  // --- Habits ---
  const habits = [];
  if (Number(profile.coding_hours) < 2) habits.push('Increase daily dedicated practice/study to at least 2 hours');
  if (Number(profile.social_media_usage) >= 4) habits.push('Limit social media to 30 mins/day');
  if (profile.project_frequency === 'rarely' || profile.project_frequency === 'never') habits.push('Complete a tangible project/case study every 6-8 weeks');
  habits.push('Read one industry article or paper daily');
  habits.push('Write a weekly learning journal');
  habits.push('Network with 1 new person in your industry weekly');

  // --- Weekly Plan ---
  const weeklyPlan = [
    'Monday: 2h deep study + 30min review',
    'Tuesday: 2h project/practical work + 30min reading',
    'Wednesday: 2h deep study + 30min networking/communication',
    'Thursday: 2h project/practical work + 30min review',
    'Friday: 2h learning + 30min portfolio/resume update',
    'Saturday: 4h deep work sprint + community engagement',
    'Sunday: Weekly review + plan next week goals',
  ];

  // --- Mistakes to avoid ---
  const mistakesToAvoid = [
    'Passive consumption – watching/reading without practicing',
    'Multitasking between too many goals at once',
    'Comparing your progress to others instead of your past self',
    'Neglecting soft skills and communication practice',
    'Not building a public portfolio or professional footprint',
    'Skipping fundamentals and jumping to advanced topics',
    'Not seeking feedback from mentors or peers',
  ];

  return { 
    skills: data.skills, 
    courses: data.courses, 
    projects: data.projects, 
    habits, 
    weeklyPlan, 
    mistakesToAvoid, 
    careerPaths: data.careerPaths 
  };
}

module.exports = { generateRecommendations };
