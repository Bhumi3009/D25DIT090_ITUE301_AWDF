import React, { useMemo } from "react";

/**
 * TaskAnalyticsChart - Heavy analytics & visualization component
 * Demonstrates component-level lazy loading (loaded only when requested).
 */
function TaskAnalyticsChart({ tasks = [] }) {
    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const priorityCounts = {
            high: tasks.filter(t => t.priority === "high").length,
            medium: tasks.filter(t => t.priority === "medium").length,
            low: tasks.filter(t => t.priority === "low").length,
        };

        return { total, completed, pending, completionRate, priorityCounts };
    }, [tasks]);

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (stats.completionRate / 100) * circumference;

    return (
        <div className="analytics-chart-container">
            <div className="chart-header">
                <h3>Task Performance & Distribution Analytics</h3>
                <span className="badge-lazy">Lazy-Loaded Chunk</span>
            </div>

            <div className="chart-grid">
                <div className="metric-cards">
                    <div className="metric-card total">
                        <span className="metric-label">Total Tasks</span>
                        <span className="metric-value">{stats.total}</span>
                    </div>
                    <div className="metric-card completed">
                        <span className="metric-label">Completed</span>
                        <span className="metric-value">{stats.completed}</span>
                    </div>
                    <div className="metric-card pending">
                        <span className="metric-label">Pending</span>
                        <span className="metric-value">{stats.pending}</span>
                    </div>
                    <div className="metric-card rate">
                        <span className="metric-label">Completion</span>
                        <span className="metric-value">{stats.completionRate}%</span>
                    </div>
                </div>

                <div className="visuals-wrapper">
                    <div className="gauge-box">
                        <svg className="radial-chart" width="120" height="120" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#1f2937"
                                strokeWidth="10"
                                fill="none"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#00b4ff"
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                            />
                            <text x="50" y="56" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold">
                                {stats.completionRate}%
                            </text>
                        </svg>
                        <p className="gauge-caption">Overall Completion</p>
                    </div>

                    <div className="priority-bars">
                        <h4>Priority Breakdown</h4>
                        <div className="bar-group">
                            <div className="bar-info">
                                <span>High Priority</span>
                                <span>{stats.priorityCounts.high}</span>
                            </div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill high"
                                    style={{ width: `${stats.total > 0 ? (stats.priorityCounts.high / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bar-group">
                            <div className="bar-info">
                                <span>Medium Priority</span>
                                <span>{stats.priorityCounts.medium}</span>
                            </div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill medium"
                                    style={{ width: `${stats.total > 0 ? (stats.priorityCounts.medium / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bar-group">
                            <div className="bar-info">
                                <span>Low Priority</span>
                                <span>{stats.priorityCounts.low}</span>
                            </div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill low"
                                    style={{ width: `${stats.total > 0 ? (stats.priorityCounts.low / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskAnalyticsChart;
