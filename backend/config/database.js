const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Connect to Postgres
const isProduction = process.env.NODE_ENV === 'production';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/futureme',
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Helper to convert SQLite '?' to Postgres '$1, $2'
async function query(sqlText, params = []) {
  let i = 1;
  const pgSql = sqlText.replace(/\?/g, () => `$${i++}`);
  
  // Also fix standard SQLite syntax differences silently if they exist
  // like datetime('now') -> CURRENT_TIMESTAMP
  const finalSql = pgSql.replace(/datetime\('now'\)/g, 'CURRENT_TIMESTAMP')
                        .replace(/INSERT OR IGNORE/g, 'INSERT') // ON CONFLICT is complex, assuming simple insert
                        // Actually, ON CONFLICT DO NOTHING is Postgres equivalent
                        .replace(/INSERT INTO profiles \(/g, 'INSERT INTO profiles ('); 

  // Since INSERT OR IGNORE is complex to regex, let's fix it explicitly for the seed:
  const seedSql = finalSql.replace(/INSERT INTO profiles \(id, user_id/g, 'INSERT INTO profiles (id, user_id')
                          .replace(/VALUES \(\$1, \$2/g, 'VALUES ($1, $2')
                          .replace(/\) ON CONFLICT DO NOTHING/g, ') ON CONFLICT (user_id) DO NOTHING');

  try {
    return await pool.query(seedSql, params);
  } catch (err) {
    // Basic error logging
    console.error('DB Query Error:', err.message, '\\nSQL:', seedSql, '\\nParams:', params);
    throw err;
  }
}

const db = {
  get: async (sql, ...params) => {
    const args = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    const res = await query(sql, args);
    return res.rows[0];
  },
  all: async (sql, ...params) => {
    const args = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    const res = await query(sql, args);
    return res.rows;
  },
  run: async (sql, ...params) => {
    const args = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    return await query(sql, args);
  },
  exec: async (sql) => {
    return await pool.query(sql);
  }
};

// Create tables
async function initDB() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      is_admin INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      age INTEGER,
      education TEXT,
      field TEXT,
      current_year TEXT,
      coding_skill REAL DEFAULT 5,
      communication_skill REAL DEFAULT 5,
      ai_knowledge REAL DEFAULT 5,
      problem_solving REAL DEFAULT 5,
      leadership REAL DEFAULT 5,
      creativity REAL DEFAULT 5,
      financial_discipline REAL DEFAULT 5,
      career_goal TEXT,
      higher_studies_goal TEXT,
      startup_interest INTEGER DEFAULT 0,
      skill_goal TEXT,
      coding_hours REAL DEFAULT 1,
      learning_hours REAL DEFAULT 1,
      communication_practice TEXT DEFAULT 'rarely',
      project_frequency TEXT DEFAULT 'rarely',
      reading_habit TEXT DEFAULT 'rarely',
      social_media_usage REAL DEFAULT 3,
      consistency_level REAL DEFAULT 5,
      github_username TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS simulations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      decision_text TEXT NOT NULL,
      skill_score REAL,
      consistency_score REAL,
      career_readiness_score REAL,
      risk_score REAL,
      growth_projection TEXT,
      optimistic_scenario TEXT,
      realistic_scenario TEXT,
      risk_scenario TEXT,
      timeline TEXT,
      recommendations TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedDemoUsers();
}

// Seed demo users
async function seedDemoUsers() {
  const existingStudent = await db.get('SELECT id FROM users WHERE email = $1', ['student@futureme.ai']);
  
  if (!existingStudent) {
    const { v4: uuidv4 } = require('uuid');
    const studentId = uuidv4();
    const adminId = uuidv4();
    const studentPass = bcrypt.hashSync('student123', 10);
    const adminPass = bcrypt.hashSync('admin123', 10);

    await db.run(`INSERT INTO users (id, name, email, password, role, is_admin) VALUES ($1, $2, $3, $4, $5, $6)`, 
      [studentId, 'Demo Student', 'student@futureme.ai', studentPass, 'student', 0]);

    await db.run(`INSERT INTO users (id, name, email, password, role, is_admin) VALUES ($1, $2, $3, $4, $5, $6)`, 
      [adminId, 'Admin User', 'admin@futureme.ai', adminPass, 'admin', 1]);

    // Seed a demo profile for student
    await db.run(`INSERT INTO profiles (id, user_id, age, education, field, current_year,
      coding_skill, communication_skill, ai_knowledge, problem_solving, leadership, creativity, financial_discipline,
      career_goal, skill_goal, coding_hours, learning_hours, social_media_usage, consistency_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) ON CONFLICT DO NOTHING`,
      [uuidv4(), studentId, 20, 'B.Tech', 'Computer Science', '2nd Year',
        7, 5, 6, 7, 4, 6, 5, 'Software Engineer', 'AI and Full-Stack Development', 2, 1.5, 3, 6]);

    console.log('✅ Demo users seeded successfully in Postgres');
  }
}

initDB().catch(console.error);

module.exports = db;
