export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: '12px'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid rgba(59, 130, 246, 0.2)',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{label}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
