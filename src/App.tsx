import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import './theme/theme.css'; // Import theme styles

// Import our custom ErrorBoundary component
import ErrorBoundary from './components/ErrorBoundary';

// Context Providers
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./components/HomePage'));
const HotelBooking = lazy(() => import('./components/HotelBooking'));
const YachtBooking = lazy(() => import('./components/YachtBooking'));
const Login = lazy(() => import('./components/Login'));
const SignUp = lazy(() => import('./components/SignUp'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const NotFound404 = lazy(() => import('./components/NotFound404'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));

type ThemeMode = 'light' | 'dark' | 'system';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode') as ThemeMode;
    return saved || 'system';
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  // Determine if system prefers dark mode
  const systemPrefersDark = useCallback(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // Apply theme based on mode
  useEffect(() => {
    const root = document.documentElement;
    let darkMode = false;

    switch (themeMode) {
      case 'dark':
        darkMode = true;
        break;
      case 'light':
        darkMode = false;
        break;
      case 'system':
      default:
        darkMode = systemPrefersDark();
        break;
    }

    setIsDarkMode(darkMode);
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', darkMode);
    
    // Store theme preference
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode, systemPrefersDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const darkMode = mediaQuery.matches;
        setIsDarkMode(darkMode);
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        document.body.classList.toggle('dark-mode', darkMode);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Toggle theme modes
  const toggleTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  // Close the theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.theme-toggle-container')) {
        setShowThemeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName="toast-container"
                toastOptions={{
                  className: 'toast-message',
                  duration: 4000,
                  style: {
                    background: isDarkMode ? '#363636' : '#fff',
                    color: isDarkMode ? '#fff' : '#363636',
                    border: isDarkMode ? '1px solid #555' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                  <LoadingSpinner size="large" fullPage message="جاري التحميل..." />
                </div>
              )}

              <Header 
                themeMode={themeMode} 
                onThemeChange={toggleTheme} 
                isDarkMode={isDarkMode} 
              />

              <main className={`main-content min-h-screen ${isLoading ? 'opacity-50' : ''}`}>
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner size="medium" message="جاري تحميل المحتوى..." />
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/hotels" element={<HotelBooking />} />
                    <Route path="/yachts" element={<YachtBooking />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route 
                      path="/admin" 
                      element={
                        <Suspense fallback={<LoadingSpinner size="large" fullPage message="جاري تحميل لوحة التحكم..." />}>
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        </Suspense>
                      } 
                    />
                    <Route path="/404" element={<NotFound404 />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
              <ScrollToTop />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
