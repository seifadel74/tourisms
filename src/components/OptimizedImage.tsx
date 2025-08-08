import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  lazy?: boolean;
  placeholderSrc?: string;
  effect?: 'blur' | 'scale' | 'fade' | 'none';
  duration?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width = '100%',
  height = 'auto',
  lazy = true,
  placeholderSrc = '/placeholder.jpg',
  effect = 'fade',
  duration = 0.3,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    const currentElement = document.querySelector(`[data-src="${src}"]`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [src, lazy]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    setImgSrc(placeholderSrc || '/placeholder.jpg');
  };

  // Animation variants
  const variants = {
    blur: {
      filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
      opacity: isLoaded ? 1 : 0.5,
    },
    scale: {
      scale: isLoaded ? 1 : 0.8,
      opacity: isLoaded ? 1 : 0,
    },
    fade: {
      opacity: isLoaded ? 1 : 0,
    },
    none: {},
  };

  return (
    <motion.div
      className={`image-container ${className}`}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      {!isLoaded && !error && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
          }}
        >
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <motion.img
        src={isInView ? src : placeholderSrc}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        data-src={src}
        onLoad={handleLoad}
        onError={handleError}
        initial={effect !== 'none' ? { opacity: 0 } : {}}
        animate={variants[effect]}
        transition={{ duration }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: isLoaded ? 'block' : 'none',
        }}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #667eea;
          animation: spin 1s linear infinite;
        }
        
        .image-container {
          position: relative;
          overflow: hidden;
        }
        
        .image-container img {
          transition: opacity 0.3s ease;
        }
      `}</style>
    </motion.div>
  );
};

export default OptimizedImage;
