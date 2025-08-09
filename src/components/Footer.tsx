import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-content">
        <div className="footer-section">
          <h3>عن الموقع</h3>
          <p>منصة سياحية متكاملة تقدم أفضل العروض على الفنادق واليخوت الفاخرة في مصر.</p>
        </div>
        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/hotels">الفنادق</Link></li>
            <li><Link to="/yachts">اليخوت</Link></li>
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>تواصل معنا</h3>
          <p>البريد الإلكتروني: info@tourism.com</p>
          <p>الهاتف: +20 123 456 7890</p>
          <div className="social-links">
            <a href="#" aria-label="فيسبوك"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="تويتر"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="انستجرام"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لموقع السياحة</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/about">عن الموقع</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
