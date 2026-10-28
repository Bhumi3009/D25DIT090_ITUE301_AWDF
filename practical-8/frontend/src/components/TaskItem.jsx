import React from "react";

/**
 * TaskItem - Memoized task card component
 * Uses React.memo to prevent unnecessary re-renders when parent state updates.
 */
const TaskItem = React.memo(function TaskItem({
    task,
    onToggle,
    onDelete,
    onStartEdit
}) {
    return (
        <div className="task-card">
            <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description || "No description available."}</p>
            </div>

            <div className="task-status">
                <div>
                    <span>Priority</span>
                    <strong className={`priority ${task.priority || "medium"}`}>
                        {task.priority || "medium"}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong className="status">
                        {task.completed ? "Completed" : "Pending"}
                    </strong>
                </div>
            </div>

            <div className="task-actions">
                <button
                    className="add-action"
                    onClick={() => onToggle(task._id, task.completed)}
                >
                    {task.completed ? "Mark Pending" : "Mark Done"}
                </button>

                <button
                    className="delete-action"
                    onClick={() => onDelete(task._id)}
                >
                    Delete
                </button>

                <button
                    className="update-action"
                    onClick={() => onStartEdit(task)}
                >
                    Update
                </button>
            </div>
        </div>
    );
});

export default TaskItem;
