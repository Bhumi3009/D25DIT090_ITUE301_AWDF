const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const validateContentType = require('../middleware/validateContentType');
const validateTaskId = require('../middleware/validateTaskId');

router.get('/', getAllTasks);
router.get('/:id', validateTaskId, getTaskById);
router.post('/', validateContentType, createTask);
router.put('/:id', validateContentType, validateTaskId, updateTask);
router.delete('/:id', validateTaskId, deleteTask);

module.exports = router;