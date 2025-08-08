<<<<<<< HEAD
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Globe, User, Menu, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import './Header.css';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOption {
  id: ThemeMode;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

const Header: React.FC<Props> = ({ themeMode, onThemeChange, isDarkMode }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useOnClickOutside(themeDropdownRef, () => setShowThemeDropdown(false));

  const themeOptions: ThemeOption[] = useMemo(() => [
    { id: 'light', label: language === 'ar' ? 'فاتح' : 'Light', icon: <Sun size={16} /> },
    { id: 'dark', label: language === 'ar' ? 'داكن' : 'Dark', icon: <Moon size={16} /> },
    { id: 'system', label: language === 'ar' ? 'النظام' : 'System', icon: <Monitor size={16} /> },
  ], [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleThemeSelect = (mode: ThemeMode) => {
    onThemeChange(mode);
    setShowThemeDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/hotels', label: t('nav.hotels') },
    { path: '/yachts', label: t('nav.yachts') },
    { path: '/about', label: t('nav.about') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      className="main-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏖️ {t('footer.tourismWebsite')}
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* Language Toggle */}
          <motion.button
            className="header-btn language-btn"
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <Globe size={20} />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </motion.button>

          {/* Theme Toggle */}
          <div className="theme-toggle-container" ref={themeDropdownRef}>
            <motion.button
              className="theme-toggle-button"
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={language === 'ar' ? 'تبديل السمة' : 'Toggle theme'}
              aria-expanded={showThemeDropdown}
              aria-haspopup="listbox"
              aria-controls="theme-options"
              id="theme-menu-button"
            >
              {themeMode === 'light' && <Sun size={20} aria-hidden="true" />}
              {themeMode === 'dark' && <Moon size={20} aria-hidden="true" />}
              {themeMode === 'system' && <Monitor size={20} aria-hidden="true" />}
              <span className="sr-only">
                {themeMode === 'light' ? t('theme.light') : 
                 themeMode === 'dark' ? t('theme.dark') : t('theme.system')}
              </span>
            </motion.button>

            <AnimatePresence>
              {showThemeDropdown && (
                <motion.div
                  className="theme-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  id="theme-options"
                  aria-labelledby="theme-menu-button"
                  aria-orientation="vertical"
                >
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`theme-option ${themeMode === option.id ? 'active' : ''}`}
                      onClick={() => handleThemeSelect(option.id)}
                      role="option"
                      aria-selected={themeMode === option.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleThemeSelect(option.id);
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          setShowThemeDropdown(false);
                        }
                      }}
                    >
                      <span className="theme-option-icon" aria-hidden="true">
                        {option.icon}
                      </span>
                      <span>{option.label}</span>
                      {themeMode === option.id && (
                        <span className="theme-option-check" aria-hidden="true">
                          <Check size={16} />
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="user-menu">
              <motion.button
                className="header-btn user-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={20} />
                <span>{user?.name}</span>
              </motion.button>

              <motion.div
                className="user-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
              >
                <Link to="/profile" className="dropdown-item">
                  {t('nav.profile')}
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  {t('nav.logout')}
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <motion.button
                  className="header-btn login-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('nav.login')}
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  className="header-btn signup-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('nav.signup')}
                </motion.button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.nav
        className="nav-mobile"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}

        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/signup"
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.signup')}
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link
              to="/profile"
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.profile')}
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="mobile-nav-link logout-btn"
            >
              {t('nav.logout')}
            </button>
          </>
        )}
      </motion.nav>
    </motion.header>
  );
};

=======
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Globe, User, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<Props> = ({ isDarkMode, toggleDarkMode }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/hotels', label: t('nav.hotels') },
    { path: '/yachts', label: t('nav.yachts') },
    { path: '/about', label: t('nav.about') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className="main-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏖️ {t('footer.tourismWebsite')}
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* Language Toggle */}
          <motion.button
            className="header-btn language-btn"
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <Globe size={20} />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            className="header-btn theme-btn"
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isDarkMode ? 'Switch to Light Mode' : 'التبديل للوضع الليلي'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="user-menu">
              <motion.button
                className="header-btn user-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={20} />
                <span>{user?.name}</span>
              </motion.button>
              
              <motion.div
                className="user-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
              >
                <Link to="/profile" className="dropdown-item">
                  {t('nav.profile')}
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  {t('nav.logout')}
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <motion.button
                  className="header-btn login-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('nav.login')}
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  className="header-btn signup-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('nav.signup')}
                </motion.button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.nav
        className="nav-mobile"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/signup"
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.signup')}
            </Link>
          </>
        )}
        
        {isAuthenticated && (
          <>
            <Link
              to="/profile"
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.profile')}
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="mobile-nav-link logout-btn"
            >
              {t('nav.logout')}
            </button>
          </>
        )}
      </motion.nav>
    </motion.header>
  );
};

>>>>>>> 2589a0280184534f4e19ab80ae72c546f6c9d5a4
export default Header;