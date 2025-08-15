import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!password) {
      newErrors.password = t('passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('passwordMinLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success(t('loginSuccess'));
        navigate('/');
      } else {
        toast.error(t('loginError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="login-title"
        >
          👋 {t('welcomeBack')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t('loginToAccess')}
        </motion.p>
      </div>
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="login-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="input-group">
          <div className="input-icon">
            <Mail size={20} />
          </div>
          <input
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <Lock size={20} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t('password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <motion.button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        </div>
        
        <div className="forgot-password">
          <Link to="/forgot-password" className="forgot-link">
            {t('forgotPassword.text')}
          </Link>
        </div>
        
        <motion.button 
          type="submit" 
          className="login-submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              {t('loggingIn')}
            </>
          ) : (
            t('login')
          )}
        </motion.button>
      </motion.form>
      
      <motion.div 
        className="login-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="signup-text">
          {t('noAccount')}{' '}
          <Link to="/signup" className="signup-link">
            {t('createAccount')}
          </Link>
        </p>
        
        <motion.button 
          className="back-home-btn" 
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={16} />
          {t('backToHome')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Login;