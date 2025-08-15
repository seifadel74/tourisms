import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201234567890', '_blank');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/yourpage', '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+201234567890';
  };

  return (
    <motion.footer 
      className="main-footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-content">
        <div className="footer-section">
          <h3>{t('footer.aboutWebsite')}</h3>
          <p>{t('footer.aboutDescription')}</p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="فيسبوك">
              <Facebook size={20} />
            </a>
            <a href="#" className="social-link" aria-label="تويتر">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="انستجرام">
              <Instagram size={20} />
            </a>
            <button onClick={handleWhatsAppClick} className="social-link" aria-label="واتساب">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>{t('footer.quickLinks')}</h3>
          <ul className="footer-links">
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/hotels">{t('nav.hotels')}</Link></li>
            <li><Link to="/yachts">{t('nav.yachts')}</Link></li>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/contact">{t('footer.contactUs')}</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>{t('footer.contactUs')}</h3>
          <div className="contact-info">
            <div className="contact-item">
              <Mail className="contact-icon" size={16} />
              <span>info@tourism.com</span>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" size={16} />
              <span>+20 123 456 7890</span>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" size={16} />
              <span>{t('footer.location')}</span>
            </div>
          </div>
          
          <div className="direct-contact">
            <h4>{t('footer.directContact')}</h4>
            <div className="contact-buttons">
              <button onClick={handleWhatsAppClick} className="contact-btn whatsapp">
                <MessageCircle size={16} />
                {t('footer.whatsapp')}
              </button>
              <button onClick={handleMessengerClick} className="contact-btn messenger">
                <MessageCircle size={16} />
                {t('footer.messenger')}
              </button>
              <button onClick={handlePhoneClick} className="contact-btn phone">
                <Phone size={16} />
                {t('footer.callNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} {t('footer.allRightsReserved')}</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms">{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
