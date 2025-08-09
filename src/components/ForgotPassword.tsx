import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    
    try {
      await forgotPassword({ email });
      setIsSuccess(true);
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إرسال الإيميل';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
          >
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">
            تم الإرسال بنجاح! 🎉
          </h2>
          
          <p className="text-gray-300 mb-6 relative z-10">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى:
            <br />
            <span className="text-blue-300 font-medium">{email}</span>
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-700/50 border border-gray-600/50 rounded-xl p-4 mb-6 backdrop-blur-sm relative z-10"
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-sm text-gray-200 text-right">
                <p className="font-medium mb-2 text-blue-300">نصائح مهمة:</p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-end gap-2">
                    <span>تحقق من صندوق الوارد والرسائل المهملة</span>
                    <span className="text-blue-400">📥</span>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>الرابط صالح لمدة 24 ساعة فقط</span>
                    <span className="text-yellow-400">⏳</span>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>إذا لم تستلم الإيميل، جرب مرة أخرى</span>
                    <span className="text-red-400">↻</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10"
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 font-medium group"
            >
              <ArrowLeft className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
              العودة إلى تسجيل الدخول
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20"
            >
              <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">نسيت كلمة المرور؟</h2>
            <p className="text-gray-300 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3.5 pr-12 bg-gray-700/50 border border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white transition-all duration-200"
                  placeholder="البريد الإلكتروني"
                  dir="rtl"
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-6 rounded-xl shadow-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ${
                  isLoading ? 'opacity-80' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="ml-2 w-4 h-4" />
                    <span>إرسال رابط إعادة التعيين</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 ml-1.5 group-hover:-translate-x-0.5 transition-transform" />
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
