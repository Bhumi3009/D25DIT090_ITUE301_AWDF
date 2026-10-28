import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import Toast from "../components/Toast";
import TaskItem from "../components/TaskItem";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from "../api";

// Supplementary Problem 1: Lazy load heavy analytics component on demand
const TaskAnalyticsChart = lazy(() => import("../components/TaskAnalyticsChart"));

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [showAnalytics, setShowAnalytics] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");

    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("medium");

    const [actionLoading, setActionLoading] = useState(null);

    const [toast, setToast] = useState({
        message: "",
        type: ""
    });

    const showToast = useCallback((message, type) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast({ message: "", type: "" });
        }, 3000);
    }, []);

    const fetchTasks = () => {
        setLoading(true);
        setError(null);

        getTasks()
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to fetch tasks.");
                }
                return response.json();
            })
            .then((data) => {
                setTasks(data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setCreateError("Task title is required.");
            showToast("Task title is required.", "error");
            return;
        }

        setCreating(true);
        setCreateError("");

        const tempId = `temp-${Date.now()}`;
        const newTask = {
            _id: tempId,
            title: title.trim(),
            description: description.trim(),
            priority,
            completed: false
        };

        setTasks((prevTasks) => [newTask, ...prevTasks]);
        setTitle("");
        setDescription("");
        setPriority("medium");

        createTask({
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to create task.");
                }
                return response.json();
            })
            .then((data) => {
                setTasks((prevTasks) =>
                    prevTasks.map((t) => (t._id === tempId ? data : t))
                );
                showToast("Task added successfully.", "success");
            })
            .catch((err) => {
                setTasks((prevTasks) =>
                    prevTasks.filter((t) => t._id !== tempId)
                );
                setCreateError(err.message);
                showToast("Failed to add task.", "error");
            })
            .finally(() => {
                setCreating(false);
            });
    };

    // Supplementary Problem 3: useCallback stabilizes handler references so TaskItem doesn't re-render unnecessarily
    const handleDelete = useCallback((id) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (!confirmed) return;

        setActionLoading(id);

        deleteTask(id)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to delete task.");
                }
                setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
                showToast("Task deleted successfully.", "success");
            })
            .catch(() => {
                showToast("Failed to delete task.", "error");
            })
            .finally(() => {
                setActionLoading(null);
            });
    }, [showToast]);

    const handleToggleStatus = useCallback((id, currentStatus) => {
        setActionLoading(id);
        const updatedStatus = !currentStatus;

        updateTask(id, { completed: updatedStatus })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update status");
                return res.json();
            })
            .then((data) => {
                setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
                showToast(`Task marked as ${updatedStatus ? "Completed" : "Pending"}.`, "success");
            })
            .catch(() => {
                showToast("Failed to update task status.", "error");
            })
            .finally(() => {
                setActionLoading(null);
            });
    }, [showToast]);

    const startEdit = useCallback((task) => {
        setEditingId(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditPriority(task.priority || "medium");
    }, []);

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditPriority("medium");
    };

    const handleUpdate = (id) => {
        if (!editTitle.trim()) {
            showToast("Task title is required.", "error");
            return;
        }

        setActionLoading(id);

        const updatedTask = {
            title: editTitle.trim(),
            description: editDescription.trim(),
            priority: editPriority
        };

        updateTask(id, updatedTask)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to update task.");
                }
                return response.json();
            })
            .then((data) => {
                setTasks((prevTasks) =>
                    prevTasks.map((task) => (task._id === id ? data : task))
                );
                cancelEdit();
                showToast("Task updated successfully.", "success");
            })
            .catch(() => {
                showToast("Failed to update task.", "error");
            })
            .finally(() => {
                setActionLoading(null);
            });
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="projects">
                <ErrorMessage message={error} />
                <button onClick={fetchTasks}>Retry</button>
            </div>
        );
    }

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="projects">
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "", type: "" })}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <h1>Task Management</h1>
                {/* Supplementary Problem 1: Button to trigger lazy-loaded analytics component */}
                <button
                    type="button"
                    className="btn-analytics-toggle"
                    onClick={() => setShowAnalytics((prev) => !prev)}
                >
                    {showAnalytics ? "📊 Hide Analytics" : "📊 Show Task Analytics"}
                </button>
            </div>

            {/* Suspense boundary for heavy analytics chart component */}
            {showAnalytics && (
                <Suspense
                    fallback={
                        <div className="lazy-fallback-card" style={{ padding: "24px", margin: "20px auto" }}>
                            <div className="lazy-spinner" style={{ width: "36px", height: "36px", margin: "0 auto 12px" }}></div>
                            <p style={{ color: "#38bdf8", fontSize: "14px" }}>Loading Task Analytics Chunk...</p>
                        </div>
                    }
                >
                    <TaskAnalyticsChart tasks={tasks} />
                </Suspense>
            )}

            <form className="task-form" onSubmit={handleCreateTask}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <button className="add-task-btn" type="submit" disabled={creating}>
                    {creating ? "Adding..." : "+ Add Task"}
                </button>
            </form>

            {createError && <p className="form-error">{createError}</p>}

            <div className="task-search">
                <input
                    type="text"
                    placeholder="Search Task..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="task-list">
                {filteredTasks.length === 0 ? (
                    <p className="no-tasks">No tasks found.</p>
                ) : (
                    filteredTasks.map((task) =>
                        editingId === task._id ? (
                            <div className="task-card" key={task._id}>
                                <div className="edit-area">
                                    <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    <input
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                    <select
                                        value={editPriority}
                                        onChange={(e) => setEditPriority(e.target.value)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <div className="edit-buttons">
                                        <button
                                            type="button"
                                            className="save-btn"
                                            onClick={() => handleUpdate(task._id)}
                                            disabled={actionLoading === task._id}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Supplementary Problem 3: Memoized TaskItem prevents re-rendering on search input change */
                            <TaskItem
                                key={task._id}
                                task={task}
                                onToggle={handleToggleStatus}
                                onDelete={handleDelete}
                                onStartEdit={startEdit}
                            />
                        )
                    )
                )}
            </div>
        </section>
    );
}

export default Tasks;
