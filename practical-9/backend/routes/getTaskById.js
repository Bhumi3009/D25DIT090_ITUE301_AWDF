const express = require("express");
const Task = require("../models/Task");
const { cache, trackHit, trackMiss } = require("../utils/cache");

const router = express.Router();

router.get("/:id", async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const cacheKey = `task_${taskId}`;
        const cachedTask = cache.get(cacheKey);

        if (cachedTask) {
            trackHit();
            res.setHeader("X-Cache", "HIT");
            console.log(`[Cache HIT] Serving single task ${taskId} from cache`);
            return res.json(cachedTask);
        }

        trackMiss();
        res.setHeader("X-Cache", "MISS");
        console.log(`[Cache MISS] Fetching single task ${taskId} from MongoDB...`);
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        cache.set(cacheKey, task);
        res.json(task);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
