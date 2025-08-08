<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './signup.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { t } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      toast.error(t('passwordMismatch'));
      return;
    }
    if (!gender) {
      setError(t('selectGender'));
      toast.error(t('selectGender'));
      return;
    }
    if (password.length < 6) {
      setError(t('passwordTooShort'));
      toast.error(t('passwordTooShort'));
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await signup(name, email, password);
      if (success) {
        toast.success(t('signupSuccess'));
        navigate('/');
      } else {
        toast.error(t('signupError'));
      }
    } catch (error) {
      toast.error(t('signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="signup-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="signup-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🚀 {t('createNewAccount')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t('joinUsAndEnjoy')}
        </motion.p>
      </div>
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="signup-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="input-group">
          <div className="input-icon">
            <User size={20} />
          </div>
          <input
            type="text"
            placeholder={t('fullName')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="signup-input"
          />
        </div>
        
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
            className="signup-input"
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
            className="signup-input"
          />
          <motion.button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <UserCheck size={20} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="signup-input"
          />
          <motion.button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        </div>
        
        <div className="gender-group">
          <label className="gender-label">
            <input
              type="radio"
              name="gender"
              value="ذكر"
              checked={gender === 'ذكر'}
              onChange={e => setGender(e.target.value)}
              required
            />
            <span className="gender-text">👨 {t('male')}</span>
          </label>
          <label className="gender-label">
            <input
              type="radio"
              name="gender"
              value="أنثى"
              checked={gender === 'أنثى'}
              onChange={e => setGender(e.target.value)}
              required
            />
            <span className="gender-text">👩 {t('female')}</span>
          </label>
        </div>
        
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="error-icon">⚠️</span>
            {error}
          </motion.div>
        )}
        
        <motion.button 
          type="submit" 
          className="signup-submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              {t('creatingAccount')}
            </>
          ) : (
            t('createAccount')
          )}
        </motion.button>
      </motion.form>
      
      <motion.div 
        className="signup-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p>
          {t('haveAccount')}{' '}
          <motion.button 
            className="switch-link" 
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('login')}
          </motion.button>
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

=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './signup.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { t } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      toast.error(t('passwordMismatch'));
      return;
    }
    if (!gender) {
      setError(t('selectGender'));
      toast.error(t('selectGender'));
      return;
    }
    if (password.length < 6) {
      setError(t('passwordTooShort'));
      toast.error(t('passwordTooShort'));
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await signup(name, email, password);
      if (success) {
        toast.success(t('signupSuccess'));
        navigate('/');
      } else {
        toast.error(t('signupError'));
      }
    } catch (error) {
      toast.error(t('signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="signup-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="signup-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🚀 {t('createNewAccount')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t('joinUsAndEnjoy')}
        </motion.p>
      </div>
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="signup-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="input-group">
          <div className="input-icon">
            <User size={20} />
          </div>
          <input
            type="text"
            placeholder={t('fullName')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="signup-input"
          />
        </div>
        
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
            className="signup-input"
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
            className="signup-input"
          />
          <motion.button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <UserCheck size={20} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="signup-input"
          />
          <motion.button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        </div>
        
        <div className="gender-group">
          <label className="gender-label">
            <input
              type="radio"
              name="gender"
              value="ذكر"
              checked={gender === 'ذكر'}
              onChange={e => setGender(e.target.value)}
              required
            />
            <span className="gender-text">👨 {t('male')}</span>
          </label>
          <label className="gender-label">
            <input
              type="radio"
              name="gender"
              value="أنثى"
              checked={gender === 'أنثى'}
              onChange={e => setGender(e.target.value)}
              required
            />
            <span className="gender-text">👩 {t('female')}</span>
          </label>
        </div>
        
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="error-icon">⚠️</span>
            {error}
          </motion.div>
        )}
        
        <motion.button 
          type="submit" 
          className="signup-submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              {t('creatingAccount')}
            </>
          ) : (
            t('createAccount')
          )}
        </motion.button>
      </motion.form>
      
      <motion.div 
        className="signup-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p>
          {t('haveAccount')}{' '}
          <motion.button 
            className="switch-link" 
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('login')}
          </motion.button>
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

>>>>>>> 2589a0280184534f4e19ab80ae72c546f6c9d5a4
export default SignUp;