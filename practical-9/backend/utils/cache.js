const NodeCache = require("node-cache");

// Default TTL: 60 seconds, check period: 120 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Empirical metrics tracking (Supplementary Problem 2)
let cacheHits = 0;
let cacheMisses = 0;

const trackHit = () => {
    cacheHits++;
};

const trackMiss = () => {
    cacheMisses++;
};

const getStats = () => {
    const total = cacheHits + cacheMisses;
    const hitRatio = total > 0 ? ((cacheHits / total) * 100).toFixed(2) + "%" : "0%";
    return {
        cacheHits,
        cacheMisses,
        totalRequests: total,
        hitRatio,
        activeKeysCount: cache.keys().length,
        activeKeys: cache.keys(),
        nodeCacheStats: cache.getStats()
    };
};

const resetStats = () => {
    cacheHits = 0;
    cacheMisses = 0;
};

// Invalidation helper for write operations
const invalidateTaskCache = (taskId = null) => {
    cache.del("all_tasks");
    if (taskId) {
        cache.del(`task_${taskId}`);
    }
};

module.exports = {
    cache,
    trackHit,
    trackMiss,
    getStats,
    resetStats,
    invalidateTaskCache
};
