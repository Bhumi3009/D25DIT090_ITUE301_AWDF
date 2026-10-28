import { lazy } from "react";

/**
 * lazyWithDelay - Wraps a dynamic import with a guaranteed minimum delay.
 * Prevents UI flickering on fast connections where a loading spinner appears
 * and disappears too quickly.
 *
 * @param {Function} importFunc - Dynamic import function, e.g. () => import('./pages/Projects')
 * @param {number} delay - Minimum delay in ms (default 300ms)
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithDelay(importFunc, delay = 300) {
    return lazy(() =>
        Promise.all([
            importFunc(),
            new Promise((resolve) => setTimeout(resolve, delay))
        ]).then(([moduleExports]) => moduleExports)
    );
}

export default lazyWithDelay;
