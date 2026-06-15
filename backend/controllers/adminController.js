const db = require('../config/database');

const getStats = async (req, res) => {
  try {
    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users WHERE is_admin = 0').count;
    const totalSimulations = await db.get('SELECT COUNT(*) as count FROM simulations').count;
    const avgSkill = await db.get('SELECT AVG(skill_score) as avg FROM simulations').avg;
    const avgRisk = await db.get('SELECT AVG(risk_score) as avg FROM simulations').avg;
    const avgConsistency = await db.get('SELECT AVG(consistency_score) as avg FROM simulations').avg;
    const avgCareer = await db.get('SELECT AVG(career_readiness_score) as avg FROM simulations').avg;

    // High risk users
    const highRiskUsers = await db.all(`
      SELECT u.name, u.email, MAX(s.risk_score) as maxRisk FROM simulations s
      JOIN users u ON s.user_id = u.id
      GROUP BY s.user_id HAVING maxRisk >= 60 LIMIT 10
    `);

    // Recent simulations
    const recentSimulations = await db.all(`
      SELECT s.id, s.decision_text, s.skill_score, s.risk_score, s.created_at, u.name as userName
      FROM simulations s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC LIMIT 10
    `);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSimulations,
        avgSkillScore: Math.round(avgSkill || 0),
        avgRiskScore: Math.round(avgRisk || 0),
        avgConsistencyScore: Math.round(avgConsistency || 0),
        avgCareerReadiness: Math.round(avgCareer || 0),
        highRiskUsers,
        recentSimulations,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await db.all(`
      SELECT u.id, u.name, u.email, u.role, u.created_at,
        COUNT(s.id) as simCount FROM users u
        LEFT JOIN simulations s ON u.id = s.user_id
        GROUP BY u.id ORDER BY u.created_at DESC
    `);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.is_admin) return res.status(403).json({ success: false, message: 'Cannot delete admin user' });
    await db.run('DELETE FROM users WHERE id = ?', req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllSimulations = async (req, res) => {
  try {
    const simulations = await db.all(`
      SELECT s.id, s.decision_text, s.skill_score, s.consistency_score, s.career_readiness_score, s.risk_score, s.created_at, u.name as userName, u.email
      FROM simulations s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC LIMIT 100
    `);
    res.json({ success: true, simulations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats, getUsers, deleteUser, getAllSimulations };
