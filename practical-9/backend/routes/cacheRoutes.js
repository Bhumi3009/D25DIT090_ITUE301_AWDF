const express = require("express");
const { cache, getStats, resetStats } = require("../utils/cache");

const router = express.Router();

// Supplementary Problem 2: Expose cache hits, misses, hit ratio and keys via debug endpoint
router.get("/stats", (req, res) => {
    res.json({
        success: true,
        data: getStats()
    });
});

// Helper endpoint to flush cache during testing
router.post("/clear", (req, res) => {
    cache.flushAll();
    resetStats();
    console.log("[Cache Debug] Cache cleared and statistics reset");
    res.json({
        success: true,
        message: "Cache flushed and counters reset"
    });
});

module.exports = router;
