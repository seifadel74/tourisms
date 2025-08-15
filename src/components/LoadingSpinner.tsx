import React from 'react';
import { motion } from 'framer-motion';
import { useOptimizedAnimation } from '../hooks/useOptimizedAnimation';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullPage?: boolean;
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#667eea',
  fullPage = false,
  message = 'Loading...',
  className = '',
}) => {  
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
  };
  
  const spinnerSize = sizeMap[size];
  const strokeWidth = Math.max(2, spinnerSize / 10);
  const radius = (spinnerSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const containerClasses = `flex flex-col items-center justify-center ${fullPage ? 'fixed inset-0 bg-white bg-opacity-90 z-50' : ''} ${className}`;
  
  return (
    <div className={containerClasses}>
      <motion.div
        className="relative"
        style={{
          width: spinnerSize,
          height: spinnerSize,
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, rotate: 0 },
          visible: { 
            opacity: 1,
            rotate: 360,
            transition: {
              rotate: {
                repeat: Infinity,
                duration: 1,
                ease: [0.65, 0, 0.35, 1] as const,
              }
            }
          }
        }}
      >
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity="0.2"
            fill="none"
          />
          <motion.circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              rotate: {
                repeat: Infinity,
                duration: 1,
                ease: [0.65, 0, 0.35, 1] as const, // cubic-bezier equivalent of 'linear'
              }
            }}
          />
        </svg>
      </motion.div>
      
      {message && (
        <motion.p 
          className="mt-4 text-gray-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
