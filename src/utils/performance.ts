/**
 * Performance optimization utilities
 */

/**
 * Throttle function to limit the rate at which a function can fire
 * @param func The function to throttle
 * @param limit Time in milliseconds
 */
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle = false;
  return function (this: any, ...args: Parameters<F>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounce function to delay the processing of a function
 * @param func The function to debounce
 * @param wait Time in milliseconds
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function (this: any, ...args: Parameters<F>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

/**
 * Preload images for better perceived performance
 * @param srcArray Array of image URLs to preload
 */
export const preloadImages = (srcArray: string[]): void => {
  srcArray.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

/**
 * Check if the user is on a slow connection
 */
export const isSlowConnection = (): boolean => {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (connection) {
    // Save Data mode enabled
    if (connection.saveData) return true;
    
    // Slow connection types
    const slowConnections = ['slow-2g', '2g', '3g'];
    return slowConnections.includes(connection.effectiveType);
  }
  
  // Default to false if connection API is not supported
  return false;
};

/**
 * Load a script asynchronously
 * @param src Script source URL
 * @param onLoad Callback when script loads
 * @param onError Callback when script fails to load
 */
export const loadScript = (
  src: string,
  onLoad?: () => void,
  onError?: (error: Event | string) => void
): void => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  
  if (onLoad) {
    script.onload = onLoad;
  }
  
  if (onError) {
    script.onerror = onError;
  }
  
  document.body.appendChild(script);
};

/**
 * Load a stylesheet asynchronously
 * @param href Stylesheet URL
 * @param onLoad Callback when stylesheet loads
 * @param onError Callback when stylesheet fails to load
 */
export const loadStylesheet = (
  href: string,
  onLoad?: () => void,
  onError?: (error: Event | string) => void
): void => {
  const link = document.createElement('link');
  link.href = href;
  link.rel = 'stylesheet';
  
  if (onLoad) {
    link.onload = onLoad;
  }
  
  if (onError) {
    link.onerror = onError;
  }
  
  document.head.appendChild(link);
};

/**
 * Check if an element is in the viewport
 * @param element The element to check
 * @param offset Pixels to add to the viewport check
 */
export const isInViewport = (element: HTMLElement, offset = 0): boolean => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= viewportHeight + offset &&
    rect.right <= viewportWidth + offset
  );
};

/**
 * Request animation frame wrapper for better performance
 * @param callback The function to call on the next animation frame
 */
export const requestAnimationFramePromise = (): Promise<number> => {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
};

/**
 * Measure time taken by a function
 * @param fn The function to measure
 * @param label Label for the measurement
 */
export const measureTime = <T>(fn: () => T, label: string): T => {
  if (process.env.NODE_ENV === 'production') {
    return fn();
  }
  
  console.time(label);
  const result = fn();
  console.timeEnd(label);
  return result;
};
