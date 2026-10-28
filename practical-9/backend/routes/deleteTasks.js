const express = require("express");
const Task = require("../models/Task");
const { invalidateTaskCache } = require("../utils/cache");

const router = express.Router();

router.delete("/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        // Invalidate both all_tasks and specific task cache
        invalidateTaskCache(req.params.id);
        console.log(`[Cache Invalidation] 'all_tasks' and 'task_${req.params.id}' cleared after DELETE`);

        res.json({
            message: "Task deleted successfully",
            task: task
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
