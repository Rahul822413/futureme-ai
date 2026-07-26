const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const isProduction = false; // Forced false to use SQLite on Render until DB is fixed
let pool;
let sqliteDb;

if (isProduction) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/futureme',
    ssl: { rejectUnauthorized: false }
  });
} else {
  sqliteDb = new sqlite3.Database(process.env.DB_PATH || './futureme.db');
}

async function query(sqlText, params = []) {
  if (isProduction) {
    let i = 1;
    const pgSql = sqlText.replace(/\?/g, () => `$${i++}`)
                         .replace(/datetime\('now'\)/g, 'CURRENT_TIMESTAMP')
                         .replace(/INSERT OR IGNORE/g, 'INSERT');
                         
    const seedSql = pgSql.replace(/\) ON CONFLICT DO NOTHING/g, ') ON CONFLICT (user_id) DO NOTHING');

    try {
      const res = await pool.query(seedSql, params);
      return res.rows;
    } catch (err) {
      console.error('PG Error:', err.message, '\\nSQL:', seedSql, '\\nParams:', params);
      throw err;
    }
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sqlText, params, function(err, rows) {
        if (err) {
          console.error('SQLite Error:', err.message, '\\nSQL:', sqlText, '\\nParams:', params);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }
}

const db = {
  get: async (sql, ...params) => {
    const args = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    const rows = await query(sql, args);
    return rows && rows.length > 0 ? rows[0] : undefined;
  },
  all: async (sql, ...params) => {
    const args = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    return await query(sql, args);
  },
  run: async (sql, ...params) => {
    const args = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    return await query(sql, args);
  },
  exec: async (sql) => {
    if (isProduction) {
      return await pool.query(sql);
    } else {
      return new Promise((resolve, reject) => {
        sqliteDb.exec(sql, function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
};

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

  await seedDemoUsers();
}

async function seedDemoUsers() {
  const existingStudent = await db.get('SELECT id FROM users WHERE email = ?', ['student@futureme.ai']);
  
  if (!existingStudent) {
    const { v4: uuidv4 } = require('uuid');
    const studentId = uuidv4();
    const adminId = uuidv4();
    const studentPass = bcrypt.hashSync('student123', 10);
    const adminPass = bcrypt.hashSync('admin123', 10);

    await db.run(`INSERT INTO users (id, name, email, password, role, is_admin) VALUES (?, ?, ?, ?, ?, ?)`, 
      [studentId, 'Demo Student', 'student@futureme.ai', studentPass, 'student', 0]);

    await db.run(`INSERT INTO users (id, name, email, password, role, is_admin) VALUES (?, ?, ?, ?, ?, ?)`, 
      [adminId, 'Admin User', 'admin@futureme.ai', adminPass, 'admin', 1]);

    await db.run(`INSERT OR IGNORE INTO profiles (id, user_id, age, education, field, current_year,
      coding_skill, communication_skill, ai_knowledge, problem_solving, leadership, creativity, financial_discipline,
      career_goal, skill_goal, coding_hours, learning_hours, social_media_usage, consistency_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), studentId, 20, 'B.Tech', 'Computer Science', '2nd Year',
        7, 5, 6, 7, 4, 6, 5, 'Software Engineer', 'AI and Full-Stack Development', 2, 1.5, 3, 6]);

    console.log('✅ Demo users seeded successfully');
  }
}

initDB().catch(console.error);

module.exports = db;
;
