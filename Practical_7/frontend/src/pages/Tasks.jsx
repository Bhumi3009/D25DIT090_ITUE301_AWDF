import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Toast from '../components/Toast';
import './Tasks.css';

const emptyForm = { title: '', description: '', priority: 'medium' };

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
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
      description: task.description || '',
      priority: task.priority || 'medium'
    });
    setActionError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setActionError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setActionError('Title is required');
      return;
    }
    setActionError(null);

    // ── Editing an existing task: wait for server ──
    if (editingId) {
      setSubmitting(true);
      const currentTask = tasks.find((t) => t._id === editingId);
      updateTask(editingId, {
        ...form,
        completed: currentTask?.completed ?? false
      })
        .then((savedTask) => {
          setTasks((prev) =>
            prev.map((t) => (t._id === editingId ? savedTask : t))
          );
          setForm(emptyForm);
          setEditingId(null);
          addToast('Task updated successfully');
        })
        .catch((err) => {
          setActionError(err.message);
          addToast(`Update failed: ${err.message}`, 'error');
        })
        .finally(() => setSubmitting(false));
      return;
    }

    // ── Creating a new task: show it immediately (optimistic update) ──
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      title: form.title,
      description: form.description,
      priority: form.priority,
      completed: false,
      isPending: true
    };

    setTasks((prev) => [optimisticTask, ...prev]);
    setForm(emptyForm);
    setSubmitting(true);

    createTask({
      title: optimisticTask.title,
      description: optimisticTask.description,
      priority: optimisticTask.priority
    })
      .then((savedTask) => {
        // Swap temp task with persisted MongoDB task
        setTasks((prev) =>
          prev.map((t) => (t._id === tempId ? savedTask : t))
        );
        addToast('Task added successfully');
      })
      .catch((err) => {
        // Rollback optimistic update on failure
        setTasks((prev) => prev.filter((t) => t._id !== tempId));
        setActionError(err.message);
        addToast(`Add failed: ${err.message}`, 'error');
      })
      .finally(() => setSubmitting(false));
  };

  const toggleCompleted = (task) => {
    setActionError(null);
    updateTask(task._id, { ...task, completed: !task.completed })
      .then((updated) => {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? updated : t))
        );
      })
      .catch((err) => {
        setActionError(err.message);
        addToast(`Update failed: ${err.message}`, 'error');
      });
  };

  const handleDelete = (task) => {
    // Confirmation dialog before deleting
    const confirmed = window.confirm(
      `Delete "${task.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(task._id);
    setActionError(null);

    deleteTask(task._id)
      .then(() => {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
        if (editingId === task._id) cancelEdit();
        addToast('Task deleted');
      })
      .catch((err) => {
        setActionError(err.message);
        addToast(`Delete failed: ${err.message}`, 'error');
      })
      .finally(() => setDeletingId(null));
  };

  if (loading) return <LoadingSpinner label="Loading your tasks..." />;
  if (loadError) return <ErrorMessage message={loadError} onRetry={loadTasks} />;

  return (
    <div className="page tasks-page">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* User Session Bar */}
      <div className="user-welcome-card bento-card span-3">
        <div className="welcome-content">
          <div>
            <h3 className="welcome-title">Welcome back, {user?.name || 'Developer'}!</h3>
            <p className="welcome-subtitle">
              Authenticated Session • Tasks are securely tied to your user ID in MongoDB.
            </p>
          </div>
          <span className="jwt-badge">🛡️ JWT Protected</span>
        </div>
      </div>

      {/* Task Form Card */}
      <div className="bento-card span-3 contact-card">
        <h2 className="card-title">{editingId ? 'Update Task' : 'New Task'}</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Task title"
              required
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
            <select
              name="priority"
              value={form.priority}
              onChange={handleFormChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          {actionError && <p className="task-error">⚠️ {actionError}</p>}

          <div className="task-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingId
                ? 'Update Task'
                : 'Add Task'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Task List Grid */}
      <div className="bento-grid task-grid">
        {tasks.length === 0 ? (
          <p className="tasks-empty">No tasks yet — add your first task above.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`bento-card span-3 task-card ${
                task.completed ? 'task-completed' : ''
              } ${task.isPending ? 'task-pending' : ''}`}
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
                  {task.isPending ? 'saving...' : task.priority}
                </span>
              </div>

              {task.description && (
                <p className="project-points">{task.description}</p>
              )}

              {!task.isPending && (
                <div className="task-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => startEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary task-delete"
                    onClick={() => handleDelete(task)}
                    disabled={deletingId === task._id}
                  >
                    {deletingId === task._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
