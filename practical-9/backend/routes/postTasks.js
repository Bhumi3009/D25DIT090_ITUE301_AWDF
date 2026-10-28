const express = require("express");
const Task = require("../models/Task");
const { cache, invalidateTaskCache } = require("../utils/cache");

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        const task = await Task.create(req.body);

        // Invalidate cache on write to avoid serving stale list
        invalidateTaskCache();
        console.log("[Cache Invalidation] 'all_tasks' cache cleared after POST /tasks");

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
