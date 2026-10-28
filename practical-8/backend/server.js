const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

require("dotenv").config();

const getTasks = require("./routes/getTasks");
const postTasks = require("./routes/postTasks");
const putTasks = require("./routes/putTasks");
const deleteTasks = require("./routes/deleteTasks");
const getTaskById = require("./routes/getTaskById");
const errorHandler = require("./middleware/errorHandler");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use("/tasks", getTasks);
app.use("/tasks", postTasks);
app.use("/tasks", putTasks);
app.use("/tasks", deleteTasks);
app.use("/tasks", getTaskById);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection failed:", err.message));

app.get("/", (req, res) => {
    res.json({
        message: "Task Management API is running"
    });
});

app.use(errorHandler);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});