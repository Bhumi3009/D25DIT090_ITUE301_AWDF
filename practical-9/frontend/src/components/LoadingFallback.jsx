import React from "react";

function LoadingFallback({ message = "Loading component chunk..." }) {
    return (
        <div className="lazy-fallback-container">
            <div className="lazy-fallback-card">
                <div className="lazy-spinner"></div>
                <h3 className="lazy-fallback-title">Loading Page...</h3>
                <p className="lazy-fallback-subtitle">{message}</p>
                <div className="lazy-skeleton-wrapper">
                    <div className="lazy-skeleton-line short"></div>
                    <div className="lazy-skeleton-line long"></div>
                    <div className="lazy-skeleton-line medium"></div>
                </div>
            </div>
        </div>
    );
}

export default LoadingFallback;
