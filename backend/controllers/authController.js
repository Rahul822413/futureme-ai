const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });

    const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = uuidv4();
    await db.run('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', id, name, email, hashedPassword, role || 'student');

    const token = generateToken(id);
    res.status(201).json({ success: true, token, user: { id, name, email, role: role || 'student', is_admin: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, is_admin: user.is_admin } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
