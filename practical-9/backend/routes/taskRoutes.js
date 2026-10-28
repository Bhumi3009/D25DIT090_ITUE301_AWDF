const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validateTask");

const getTasks = require("./getTasks");
const postTasks = require("./postTasks");
const putTasks = require("./putTasks");
const deleteTasks = require("./deleteTasks");
const getTaskById = require("./getTaskById");
const cacheRoutes = require("./cacheRoutes");

const router = express.Router();

// Mount debug cache metrics endpoint (Supplementary Problem 2)
router.use("/cache", cacheRoutes);

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, validateTask, postTasks);
router.put("/:id", authMiddleware, validateTask, putTasks);
router.delete("/:id", authMiddleware, deleteTasks);
router.get("/:id", authMiddleware, getTaskById);

module.exports = router;
