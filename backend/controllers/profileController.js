const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const axios = require('axios');

const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const existing = await db.get('SELECT id FROM profiles WHERE user_id = ?', userId);
    const id = existing ? existing.id : uuidv4();
    const p = req.body;

    let githubUsername = p.githubUsername || null;
    let extraCodingHours = 0;
    let extraConsistency = 0;

    if (githubUsername) {
      try {
        const ghRes = await axios.get(`https://api.github.com/users/${githubUsername}`);
        const data = ghRes.data;
        if (data.public_repos > 10) extraCodingHours += 1;
        if (data.public_repos > 30) extraCodingHours += 1;
        if (data.followers > 5) extraConsistency += 1;
        if (data.created_at) {
          const ageYears = (new Date() - new Date(data.created_at)) / (1000 * 60 * 60 * 24 * 365);
          if (ageYears > 2) extraConsistency += 1;
        }
      } catch (e) {
        console.error('GitHub API Error:', e.message);
      }
    }

    p.codingHours = Math.min(12, Number(p.codingHours || 1) + extraCodingHours);
    p.consistencyLevel = Math.min(10, Number(p.consistencyLevel || 5) + extraConsistency);

    if (existing) {
      await db.run(`UPDATE profiles SET age=?,education=?,field=?,current_year=?,coding_skill=?,communication_skill=?,
        ai_knowledge=?,problem_solving=?,leadership=?,creativity=?,financial_discipline=?,career_goal=?,
        higher_studies_goal=?,startup_interest=?,skill_goal=?,coding_hours=?,learning_hours=?,
        communication_practice=?,project_frequency=?,reading_habit=?,social_media_usage=?,consistency_level=?,github_username=?
        WHERE user_id=?`, p.age, p.education, p.field, p.currentYear, p.codingSkill, p.communicationSkill,
        p.aiKnowledge, p.problemSolving, p.leadership, p.creativity, p.financialDiscipline, p.careerGoal,
        p.higherStudiesGoal, p.startupInterest ? 1 : 0, p.skillGoal, p.codingHours, p.learningHours,
        p.communicationPractice, p.projectFrequency, p.readingHabit, p.socialMediaUsage, p.consistencyLevel, githubUsername, userId);
    } else {
      await db.run(`INSERT INTO profiles (id,user_id,age,education,field,current_year,coding_skill,communication_skill,
        ai_knowledge,problem_solving,leadership,creativity,financial_discipline,career_goal,higher_studies_goal,
        startup_interest,skill_goal,coding_hours,learning_hours,communication_practice,project_frequency,
        reading_habit,social_media_usage,consistency_level,github_username) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        id, userId, p.age, p.education, p.field, p.currentYear, p.codingSkill, p.communicationSkill,
        p.aiKnowledge, p.problemSolving, p.leadership, p.creativity, p.financialDiscipline, p.careerGoal,
        p.higherStudiesGoal, p.startupInterest ? 1 : 0, p.skillGoal, p.codingHours, p.learningHours,
        p.communicationPractice, p.projectFrequency, p.readingHabit, p.socialMediaUsage, p.consistencyLevel, githubUsername);
    }

    const profile = await db.get('SELECT * FROM profiles WHERE user_id = ?', userId);
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await db.get('SELECT * FROM profiles WHERE user_id = ?', req.params.userId);
    res.json({ success: true, profile: profile || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createProfile, getProfile };
