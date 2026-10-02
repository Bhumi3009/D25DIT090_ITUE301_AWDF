/**
 * Practical 5 – MongoDB Integration and Schema Design with Mongoose
 *
 * Objective: Replace the in-memory array from Practical 4 with a real
 * MongoDB database accessed through the Mongoose ODM.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Mongoose model
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

/* ─────────────────────────────────────────────
   Middleware Pipeline
───────────────────────────────────────────── */

// 1. Allow React frontend to access this backend
app.use(cors());

// 2. Parse JSON request bodies
app.use(express.json());

// 3. Request logger
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );
    next();
});

// 4. Content-Type check for write operations
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
   Helper: Format Mongoose validation errors
───────────────────────────────────────────── */

function formatValidationError(err) {
    const errors = {};

    Object.keys(err.errors).forEach((field) => {
        errors[field] = err.errors[field].message;
    });

    return errors;
}

/* ─────────────────────────────────────────────
   CRUD Routes
───────────────────────────────────────────── */

// GET /tasks – return all tasks
app.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// GET /tasks/:id – return a single task
app.get('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        res.status(200).json(task);
    } catch (err) {

        // Invalid MongoDB ObjectId
        if (err.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid task ID format'
            });
        }

        next(err);
    }
});

// POST /tasks – create a new task
app.post('/tasks', async (req, res, next) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            priority: req.body.priority
        });

        res.status(201).json(task);
    } catch (err) {

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                errors: formatValidationError(err)
            });
        }

        next(err);
    }
});

// PUT /tasks/:id – update an existing task
app.put('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed,
                priority: req.body.priority
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        res.status(200).json(task);
    } catch (err) {

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                errors: formatValidationError(err)
            });
        }

        // Invalid MongoDB ObjectId
        if (err.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid task ID format'
            });
        }

        next(err);
    }
});

// DELETE /tasks/:id – delete a task
app.delete('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task deleted successfully',
            task
        });
    } catch (err) {

        // Invalid MongoDB ObjectId
        if (err.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid task ID format'
            });
        }

        next(err);
    }
});

/* ─────────────────────────────────────────────
   404 Handler – undefined routes
───────────────────────────────────────────── */

app.use((req, res) => {
    res.status(404).json({
        error: `Route ${req.method} ${req.url} not found`
    });
});

/* ─────────────────────────────────────────────
   Global Error Handler
   Must be the last middleware
───────────────────────────────────────────── */

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);

    res.status(500).json({
        error: 'Something went wrong on the server'
    });
});

/* ─────────────────────────────────────────────
   Connect to MongoDB, then start the server
───────────────────────────────────────────── */

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);

            console.log('Available routes:');
            console.log('  GET    /tasks');
            console.log('  GET    /tasks/:id');
            console.log('  POST   /tasks');
            console.log('  PUT    /tasks/:id');
            console.log('  DELETE /tasks/:id');
        });
    })
    .catch((err) => {
        console.error(
            'MongoDB connection failed:',
            err.message
        );

        console.error(
            'Make sure your MONGO_URI in .env is correct.'
        );

        process.exit(1);
    });