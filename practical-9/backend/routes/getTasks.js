const express = require("express");
const Task = require("../models/Task");
const { cache, trackHit, trackMiss } = require("../utils/cache");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const cacheKey = "all_tasks";
        const cachedTasks = cache.get(cacheKey);

        if (cachedTasks) {
            trackHit();
            res.setHeader("X-Cache", "HIT");
            console.log("[Cache HIT] Serving all_tasks from in-memory cache");
            return res.json(cachedTasks);
        }

        trackMiss();
        res.setHeader("X-Cache", "MISS");
        console.log("[Cache MISS] Querying MongoDB for tasks...");
        const tasks = await Task.find();
        cache.set(cacheKey, tasks);

        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
