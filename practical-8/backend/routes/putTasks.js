const express = require("express");
const Task = require("../models/Task");

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

        res.json(task);
    } catch (err) {
        next(err);
    }
});

module.exports = router;