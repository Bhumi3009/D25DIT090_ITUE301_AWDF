

const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: "Validation failed",
            details: Object.values(err.errors).map(error => error.message)
        });
    }

    res.status(500).json({
        error: "Internal server error"
    });
};

module.exports = errorHandler;