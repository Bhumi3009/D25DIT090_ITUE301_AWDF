import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Toast from "../components/Toast";
import "./Tasks.css";

const emptyForm = { title: "", description: "", priority: "medium" };

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadTasks = () => {
    setLoading(true);
    setLoadError(null);
    getTasks()
      .then(setTasks)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
    });
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setActionError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setActionError("Title is required");
      return;
    }

    setActionError(null);

    // ── Editing an existing task: wait for the server, same as before ──
    if (editingId) {
      setSubmitting(true);
      const currentTask = tasks.find((t) => t._id === editingId);
      updateTask(editingId, { ...form, completed: currentTask?.completed ?? false })
        .then((savedTask) => {
          setTasks((prev) => prev.map((t) => (t._id === editingId ? savedTask : t)));
          setForm(emptyForm);
          setEditingId(null);
          addToast("Task updated");
        })
        .catch((err) => {
          setActionError(err.message);
          addToast(`Update failed: ${err.message}`, "error");
        })
        .finally(() => setSubmitting(false));
      return;
    }

    // ── Creating a new task: show it immediately (optimistic), reconcile after ──
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      title: form.title,
      description: form.description,
      priority: form.priority,
      completed: false,
      isPending: true,
    };

    setTasks((prev) => [optimisticTask, ...prev]);
    setForm(emptyForm);
    setSubmitting(true);

    createTask({ title: optimisticTask.title, description: optimisticTask.description, priority: optimisticTask.priority })
      .then((savedTask) => {
        setTasks((prev) => prev.map((t) => (t._id === tempId ? savedTask : t)));
        addToast("Task added");
      })
      .catch((err) => {
        // Roll back the optimistic card since the server rejected it
        setTasks((prev) => prev.filter((t) => t._id !== tempId));
        setActionError(err.message);
        addToast(`Add failed: ${err.message}`, "error");
      })
      .finally(() => setSubmitting(false));
  };

  const toggleCompleted = (task) => {
    setActionError(null);
    updateTask(task._id, { ...task, completed: !task.completed })
      .then((updated) => {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      })
      .catch((err) => {
        setActionError(err.message);
        addToast(`Update failed: ${err.message}`, "error");
      });
  };

  const handleDelete = (task) => {
    const confirmed = window.confirm(`Delete "${task.title}"? This can't be undone.`);
    if (!confirmed) return;

    setDeletingId(task._id);
    setActionError(null);
    deleteTask(task._id)
      .then(() => {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
        if (editingId === task._id) cancelEdit();
        addToast("Task deleted");
      })
      .catch((err) => {
        setActionError(err.message);
        addToast(`Delete failed: ${err.message}`, "error");
      })
      .finally(() => setDeletingId(null));
  };

  if (loading) return <LoadingSpinner label="Loading tasks..." />;
  if (loadError) return <ErrorMessage message={loadError} onRetry={loadTasks} />;

  return (
    <div className="page">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="bento-card span-3 contact-card">
        <h2 className="card-title">{editingId ? "Update Task" : "New Task"}</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Task title"
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Details (optional)"
              rows={3}
            />
          </label>
          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleFormChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          {actionError && <p className="task-error">{actionError}</p>}

          <div className="task-form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update Task" : "Add Task"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bento-grid task-grid">
        {tasks.length === 0 && <p className="tasks-empty">No tasks yet — add one above.</p>}

        {tasks.map((task) => (
          <div
            key={task._id}
            className={`bento-card span-3 task-card ${task.completed ? "task-completed" : ""} ${task.isPending ? "task-pending" : ""}`}
          >
            <div className="task-card-header">
              <label className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.completed}
                  disabled={task.isPending}
                  onChange={() => toggleCompleted(task)}
                />
                <h2 className="card-title">{task.title}</h2>
              </label>
              <span className={`tech-tag priority-${task.priority}`}>
                {task.isPending ? "saving..." : task.priority}
              </span>
            </div>

            {task.description && <p className="project-points">{task.description}</p>}

            {!task.isPending && (
              <div className="task-actions">
                <button className="btn btn-secondary" onClick={() => startEdit(task)}>
                  Edit
                </button>
                <button
                  className="btn btn-secondary task-delete"
                  onClick={() => handleDelete(task)}
                  disabled={deletingId === task._id}
                >
                  {deletingId === task._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;