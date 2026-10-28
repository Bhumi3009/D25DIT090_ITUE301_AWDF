const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

module.exports = router;