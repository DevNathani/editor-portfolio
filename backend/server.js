import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import categoryRoutes from './routes/categoryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillsServicesRoutes from './routes/skillsServicesRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Request Logging Middleware (Placed before CORS to capture rejected requests)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174',
  ],
  credentials: true,
}));
app.use(express.json());

// Global Rate Limiter (e.g., 100 requests per 15 minutes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// Strict Auth Rate Limiter (e.g., 5 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills-services', skillsServicesRoutes);
app.use('/api/contact', contactRoutes);

// Database Connection
connectDB();

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio Backend API' });
});

// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
