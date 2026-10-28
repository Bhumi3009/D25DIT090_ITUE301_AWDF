const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/:id", async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(task);
    } catch (err) {
        next(err);
    }
});

module.exports = router;