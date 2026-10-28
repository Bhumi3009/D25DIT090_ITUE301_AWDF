/**
 * Validation Middleware Pipeline
 * Enforces server-side validation rules before requests reach the controllers.
 */

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// Validate User Registration payload
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate User Login payload
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate Task Creation and Update payload
const validateTask = (req, res, next) => {
  const { title, priority } = req.body;
  const errors = {};

  // For POST or when title is provided in PUT
  if (req.method === 'POST' || (req.method === 'PUT' && title !== undefined)) {
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.title = 'Task title is required and cannot be empty';
    }
  }

  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      errors.priority = 'Priority must be one of: low, medium, high';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask
};
