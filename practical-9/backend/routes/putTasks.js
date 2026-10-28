const express = require("express");
const Task = require("../models/Task");
const { invalidateTaskCache } = require("../utils/cache");

const router = express.Router();

router.put("/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        // Invalidate both all_tasks and specific task cache
        invalidateTaskCache(req.params.id);
        console.log(`[Cache Invalidation] 'all_tasks' and 'task_${req.params.id}' cleared after PUT`);

        res.json(task);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
