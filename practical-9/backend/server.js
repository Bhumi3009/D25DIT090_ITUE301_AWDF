const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection failed:", err.message));

app.get("/", (req, res) => {
    res.json({
        message: "Task Management API with node-cache is running"
    });
});

app.use(errorHandler);

app.listen(5000, () => {
    console.log("Server running on port 5000 with in-memory caching enabled");
});
