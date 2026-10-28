const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.delete("/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: task
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;