// ============================================================
// Be Fit - Main Server Entry Point
// ============================================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────

// CORS - allow frontend to communicate with backend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/user',    require('./routes/userRoutes'));
app.use('/api/workouts',require('./routes/workoutRoutes'));
app.use('/api/meals',   require('./routes/nutritionRoutes'));
app.use('/api/goals',   require('./routes/goalRoutes'));
app.use('/api/ai',      require('./routes/aiRoutes'));
app.use('/api/admin',   require('./routes/adminRoutes'));

// ── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Be Fit API is running 💪', timestamp: new Date() });
});

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Be Fit Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});
