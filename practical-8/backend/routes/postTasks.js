const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

module.exports = router;