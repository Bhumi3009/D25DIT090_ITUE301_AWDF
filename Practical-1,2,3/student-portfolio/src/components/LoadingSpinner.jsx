import "./LoadingSpinner.css";

export default function LoadingSpinner({ label = "Loading repositories..." }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner"></div>
      <p className="spinner-label">{label}</p>
    </div>
  );
}