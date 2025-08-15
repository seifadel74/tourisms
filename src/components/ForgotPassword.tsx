import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, Clock, Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import './forgot-password.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
} as const;

// Cooldown period in seconds
const RESEND_COOLDOWN = 60;

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  
  // Validate email format
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Handle cooldown timer
  useEffect(() => {
    if (isResendDisabled && cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown((prev: number) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (cooldown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
  }, [cooldown, isResendDisabled]);
  
  // Start cooldown timer
  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    setIsResendDisabled(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string } = {};
    
    if (!email) {
      newErrors.email = t('emailRequired') || 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('invalidEmail') || 'البريد الإلكتروني غير صالح';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await forgotPassword({ email });
      setIsSuccess(true);
      startCooldown();
      
      // Show success message with email
      setError('');
      toast.success(t('resetLinkSent') || 'تم إرسال رابط إعادة التعيين بنجاح', {
        icon: '✅',
        style: {
          borderRadius: '8px',
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #86efac',
        },
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      let errorMessage = t('resetLinkError') || 'حدث خطأ أثناء إرسال رابط إعادة التعيين';
      
      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = t('emailNotFound') || 'البريد الإلكتروني غير مسجل';
        } else if (error.response.status === 429) {
          errorMessage = t('tooManyRequests') || 'لقد تجاوزت الحد المسموح من المحاولات. يرجى الانتظار قليلاً';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        icon: '❌',
        style: {
          borderRadius: '8px',
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle back to login
  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Handle resend email
  const handleResend = async () => {
    if (isResendDisabled) return;
    
    setIsResendDisabled(true);
    setCooldown(RESEND_COOLDOWN);
    setError('');
    
    try {
      await forgotPassword({ email });
      setIsSuccess(true);
      
      toast.success(t('resetLinkResent') || 'تم إعادة إرسال رابط إعادة التعيين بنجاح', {
        icon: '🔄',
        style: {
          borderRadius: '8px',
          background: '#f0f9ff',
          color: '#0369a1',
          border: '1px solid #bae6fd',
        },
      });
    } catch (error: any) {
      console.error('Error resending reset link:', error);
      const errorMessage = error.response?.data?.message || t('resetLinkError') || 'حدث خطأ أثناء إعادة إرسال الرابط';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        icon: '❌',
        style: {
          borderRadius: '8px',
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="success-message">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h2>{t('emailSentSuccessfully') || 'تم الإرسال بنجاح!'} 🎉</h2>
            <p className="email-sent-message">
              {t('resetLinkSentTo') || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى:'}
              <br />
              <span>{email}</span>
            </p>
            
            <div className="tips-container">
              <div className="tips-content">
                <div className="tips-icon">
                  <AlertCircle className="icon" />
                </div>
                <div className="tips-text">
                  <p className="tips-title">{t('importantTips') || 'نصائح مهمة:'}</p>
                  <ul className="tips-list">
                    <li>
                      <span>{t('checkInboxAndSpam') || 'تحقق من صندوق الوارد والرسائل المهملة'}</span>
                    </li>
                    <li>
                      <span>{t('linkValid24Hours') || 'الرابط صالح لمدة 24 ساعة فقط'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              <ArrowLeft className="icon" />
              {t('backToLogin') || 'العودة إلى تسجيل الدخول'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>{t('forgotPassword.title') || 'إعادة تعيين كلمة المرور'}</h1>
          <p>{t('forgotPassword.subtitle') || 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور'}</p>
        </div>

        {isSuccess ? (
          <div className="success-message">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h2>{t('forgotPassword.success.title')}</h2>
            <p>{`${t('forgotPassword.success.message')} ${email}`}</p>
            <button 
              type="button"
              onClick={handleBackToLogin}
              className="btn btn-primary"
            >
              <ArrowLeft size={16} className="icon" />
              {t('backToLogin') || 'العودة لتسجيل الدخول'}
            </button>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="message error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertTriangle className="icon" />
                  <span className="message-content">{error}</span>
                </motion.div>
              )}
              
              {isSuccess && (
                <motion.div 
                  className="message success-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <CheckCircle className="icon" />
                  <span className="message-content">
                    {t('resetLinkSentTo') || 'تم إرسال رابط إعادة التعيين إلى:'} <strong>{email}</strong>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">
                  {t('forgotPassword.form.email')}
                </label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('forgotPassword.form.emailPlaceholder')}
                    className={errors.email ? 'error' : ''}
                  />
                  <Mail className="input-icon" />
                </div>
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || isResendDisabled}
                className="btn btn-submit"
                whileHover={!isLoading && !isResendDisabled ? { scale: 1.01 } : {}}
                whileTap={!isLoading && !isResendDisabled ? { scale: 0.99 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="loading-spinner" />
                    {t('sending') || 'جاري الإرسال...'}
                  </>
                ) : isResendDisabled ? (
                  <>
                    <span className="cooldown-timer">
                      <Clock className="icon" />
                      {cooldown}
                    </span>
                    {t('resendIn') || 'انتظر لإعادة المحاولة'}
                  </>
                ) : (
                  <>{t('forgotPassword.form.submit') || 'إرسال رابط إعادة التعيين'}</>
                )}
              </motion.button>
            </form>

            <div className="back-to-login">
              <button type="button" onClick={handleBackToLogin}>
                <ArrowLeft className="icon" />
                {t('forgotPassword.backToLogin')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
