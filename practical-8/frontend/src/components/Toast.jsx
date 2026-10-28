function Toast({ message, type, onClose }) {
    if (!message) {
        return null;
    }

    return (
        <div className={`toast ${type}`}>
            <span>{type === "success" ? "✓" : "✕"}</span>

            <p>{message}</p>

            <button onClick={onClose}>×</button>
        </div>
    );
}

export default Toast;