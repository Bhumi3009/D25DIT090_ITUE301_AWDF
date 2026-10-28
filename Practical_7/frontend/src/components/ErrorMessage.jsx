export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      padding: '16px 20px',
      margin: '20px 0',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      color: '#f87171',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <span>⚠️ {message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
