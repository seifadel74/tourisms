import { useState, useEffect, useRef } from 'react';
import { throttle } from '../utils/performance';

/**
 * Hook to optimize animations based on device capabilities
 * @param defaultEnabled Whether animations should be enabled by default
 * @param throttleDelay Throttle delay for scroll/resize events (in ms)
 */
export const useOptimizedAnimation = (defaultEnabled = true, throttleDelay = 100) => {
  const [shouldAnimate, setShouldAnimate] = useState(defaultEnabled);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setIsReducedMotion(mediaQuery.matches);
      setShouldAnimate(!mediaQuery.matches);
    };
    
    // Set initial value
    handleChange();
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Check for mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileDevice);
      
      // Disable animations on mobile by default if not already set by reduced motion
      if (isMobileDevice && shouldAnimate) {
        setShouldAnimate(false);
      }
    };
    
    checkIfMobile();
    
    // Re-check on resize
    const handleResize = throttle(() => {
      checkIfMobile();
    }, throttleDelay);
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldAnimate, throttleDelay]);

  // Check for slow connection
  useEffect(() => {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    const checkConnection = () => {
      if (connection) {
        // Check for slow connection types (2G, 3G, etc.)
        const slowConnections = ['slow-2g', '2g', '3g'];
        const isSlow = connection.saveData || slowConnections.includes(connection.effectiveType);
        
        setIsSlowConnection(isSlow);
        
        // Disable animations on slow connections
        if (isSlow && shouldAnimate) {
          setShouldAnimate(false);
        }
      }
    };
    
    checkConnection();
    
    // Listen for connection changes
    if (connection) {
      connection.addEventListener('change', checkConnection);
      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }
  }, [shouldAnimate]);

  // Handle scroll-based animations
  const handleScroll = useRef(
    throttle(() => {
      if (ticking.current) return;
      
      ticking.current = true;
      
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        // Only update if scroll position has changed significantly
        if (Math.abs(currentScrollY - lastScrollY.current) > 50) {
          lastScrollY.current = currentScrollY;
        }
        ticking.current = false;
      });
    }, throttleDelay)
  ).current;

  // Set up scroll listener for scroll-based animations
  useEffect(() => {
    if (shouldAnimate) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll, shouldAnimate]);

  // Get animation variants based on device capabilities
  const getAnimationVariants = (variants: any) => {
    if (!shouldAnimate) {
      // Return a no-animation variant
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      };
    }
    
    // Return the provided variants if animations are enabled
    return variants;
  };

  // Get optimized animation props for Framer Motion
  const getAnimationProps = (customVariants: any, customTransition = {}) => {
    const baseTransition = {
      duration: isMobile ? 0.5 : 0.3,
      ease: 'easeOut',
      ...customTransition,
    };

    return {
      initial: 'hidden',
      animate: shouldAnimate ? 'visible' : 'hidden',
      variants: getAnimationVariants(customVariants),
      transition: baseTransition,
    };
  };

  return {
    shouldAnimate,
    isReducedMotion,
    isMobile,
    isSlowConnection,
    getAnimationVariants,
    getAnimationProps,
    enableAnimations: () => setShouldAnimate(true),
    disableAnimations: () => setShouldAnimate(false),
  };
};

export default useOptimizedAnimation;
