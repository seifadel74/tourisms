import React from 'react';
import { motion } from 'framer-motion';

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
  isDarkMode?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset, isDarkMode = false }) => {
  return (
    <motion.div 
      className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-md w-full rounded-xl p-6 text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
        <div className="text-red-500 mb-4">
          <svg 
            className="w-16 h-16 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          حدث خطأ ما
        </h2>
        
        <p className="mb-4">
          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
        </p>
        
        {error && (
          <details className="mb-4 text-left">
            <summary className="text-sm font-medium cursor-pointer mb-2">
              تفاصيل الخطأ
            </summary>
            <pre className={`p-3 rounded-md text-xs overflow-auto max-h-40 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {error.message}
            </pre>
          </details>
        )}
        
        <div className="flex justify-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            إعادة المحاولة
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-md transition-colors"
          >
            تحديث الصفحة
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorFallback;
