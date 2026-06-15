require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

// Initialize DB (creates tables and seeds demo data)
require('./config/database');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/simulation', require('./routes/simulation'));
app.use('/api/report', require('./routes/report'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'FutureMe AI Backend running ✅', timestamp: new Date().toISOString() }));

// Deploy route
app.post('/api/deploy', (req, res) => {
  const frontendPath = path.join(__dirname, '..', 'frontend');
  console.log('Starting frontend build at', frontendPath);
  exec('npm run build', { cwd: frontendPath }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Build error: ${error.message}`);
      return res.status(500).json({ success: false, message: 'Deploy failed', error: error.message });
    }
    console.log('Build output:', stdout);
    res.json({ success: true, message: 'Deployment build completed successfully.' });
  });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Catch-all route to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 FutureMe AI Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Demo: student@futureme.ai / student123`);
  console.log(`🔐 Admin: admin@futureme.ai / admin123\n`);
});
