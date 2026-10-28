/**
 * Practical 7: Authentication and Middleware Pipeline
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student Roll No: D25DIT090
 *
 * Objective: To implement JWT-based authentication and input validation
 * as part of the Express middleware pipeline.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

/* ─────────────────────────────────────────────
 Middleware Pipeline
───────────────────────────────────────────── */

// 1. CORS Configuration (Allows React frontend at localhost:5173 to access API)
app.use(cors());

// 2. Parse JSON request bodies
app.use(express.json());

// 3. Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 4. Content-Type validation for POST & PUT write requests
app.use((req, res, next) => {
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    req.headers['content-type'] !== 'application/json'
  ) {
    return res.status(400).json({
      error: 'Content-Type must be application/json for POST and PUT requests'
    });
  }
  next();
});

/* ─────────────────────────────────────────────
 Mount Routes
───────────────────────────────────────────── */
// Public / Auth routes (register, login, me)
app.use('/auth', authRoutes);

// Protected Task CRUD routes (guarded by authMiddleware inside taskRoutes)
app.use('/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'ITUE301 Practical 7 Auth & Task API'
  });
});

/* ─────────────────────────────────────────────
 404 Handler – Undefined routes
───────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} not found`
  });
});

/* ─────────────────────────────────────────────
 Global Error Handler (Must be the last middleware)
───────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server'
  });
});

/* ─────────────────────────────────────────────
 Connect to MongoDB, then start the server
───────────────────────────────────────────── */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager_practical7';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Available endpoints:');
      console.log('  POST /auth/register    - Register user (bcrypt hashed)');
      console.log('  POST /auth/login       - Login & receive JWT token');
      console.log('  GET  /auth/me          - [Protected] Get current user profile');
      console.log('  GET  /tasks            - [Protected] Get all user tasks');
      console.log('  POST /tasks            - [Protected] Create new task');
      console.log('  GET  /tasks/:id        - [Protected] Get task by ID');
      console.log('  PUT  /tasks/:id        - [Protected] Update task');
      console.log('  DELETE /tasks/:id     - [Protected] Delete task');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.error('Make sure your MONGO_URI in .env is correct.');
    // Start server even if MongoDB is offline so tests and routes can be verified
    app.listen(PORT, () => {
      console.log(`Server running in offline-DB mode on http://localhost:${PORT}`);
    });
  });

module.exports = app;
