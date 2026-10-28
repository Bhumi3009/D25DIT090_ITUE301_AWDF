const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');

const router = express.Router();

// Step 6 in lab manual: Apply the auth middleware to all task routes
router.use(authMiddleware);

/**
 * Helper: Format Mongoose validation errors
 */
function formatValidationError(err) {
  const errors = {};
  Object.keys(err.errors).forEach((field) => {
    errors[field] = err.errors[field].message;
  });
  return errors;
}

/**
 * @route   GET /tasks
 * @desc    Get all tasks belonging to the authenticated user
 * @access  Private (JWT Protected)
 */
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /tasks/:id
 * @desc    Get single task by ID for authenticated user
 * @access  Private (JWT Protected)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    next(err);
  }
});

/**
 * @route   POST /tasks
 * @desc    Create a new task for the authenticated user
 * @access  Private (JWT Protected)
 */
router.post('/', validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: completed === true,
      priority: priority || 'medium'
    });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    next(err);
  }
});

/**
 * @route   PUT /tasks/:id
 * @desc    Update an existing task
 * @access  Private (JWT Protected)
 */
router.put('/:id', validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(completed !== undefined && { completed: Boolean(completed) }),
        ...(priority !== undefined && { priority })
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    next(err);
  }
});

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task
 * @access  Private (JWT Protected)
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.status(200).json({
      message: 'Task deleted successfully',
      task
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    next(err);
  }
});

module.exports = router;
