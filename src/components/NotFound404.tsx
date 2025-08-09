import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './NotFound404.css';

const NotFound404: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <motion.div 
      className="notfound-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="notfound-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div 
          className="notfound-icon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
        >
          <AlertTriangle size={80} />
        </motion.div>
        
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="notfound-title"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="notfound-subtitle"
        >
          {t('pageNotFound')}
        </motion.h2>
        
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="notfound-description"
        >
          {t('pageNotFoundDescription')}
        </motion.p>
        
        <motion.div 
          className="notfound-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.button 
            className="notfound-home-btn primary"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} />
            {t('backToHome')}
          </motion.button>
          
          <motion.button 
            className="notfound-back-btn secondary"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            {t('goBack')}
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="notfound-search"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <p>{t('trySearching')}</p>
          <motion.button 
            className="search-btn"
            onClick={() => navigate('/hotels')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={16} />
            {t('searchHotels')}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound404;