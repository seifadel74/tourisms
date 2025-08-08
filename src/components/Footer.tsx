<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    const phoneNumber = '201234567890';
    const message = encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم السياحية');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/yourpage', '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:+201234567890', '_blank');
  };

  return (
    <motion.footer 
      className="main-footer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-content">
        <div className="footer-section">
          <h3>موقع السياحة</h3>
          <p>نقدم أفضل الخدمات السياحية مع ضمان الجودة والراحة</p>
          <div className="social-links">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="فيسبوك"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"
                  fill="currentColor"
                />
              </svg>
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="انستجرام"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.784 2.226 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.292 2.393 1.272 3.373.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.374-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.292-2.393-1.272-3.373-.981-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm7.2-10.406a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"
                  fill="currentColor"
                />
              </svg>
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="تويتر"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  fill="currentColor"
                />
              </svg>
            </motion.a>
          </div>
        </div>

        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul className="footer-links">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/hotels">الفنادق</Link></li>
            <li><Link to="/yachts">اليخوت</Link></li>
            <li><Link to="/about">عن الموقع</Link></li>
            <li><Link to="/privacy">سياسة الخصوصية</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>خدماتنا</h3>
          <ul className="footer-links">
            <li>حجز الفنادق</li>
            <li>حجز اليخوت</li>
            <li>جولات سياحية</li>
            <li>خدمة العملاء</li>
            <li>الدعم الفني</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t('footer.contactUs')}</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>القاهرة، مصر</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>info@tourism.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+20 123 456 7890</span>
            </div>
          </div>
          
          <div className="direct-contact">
            <h4>تواصل مباشر</h4>
            <div className="contact-buttons">
              <motion.button
                className="contact-btn whatsapp"
                onClick={handleWhatsAppClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="واتساب"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.52 3.48A12 12 0 003.48 20.52l-1.32 4.84a1 1 0 001.22 1.22l4.84-1.32A12 12 0 1020.52 3.48zm-8.52 17a10 10 0 1110-10 10 10 0 01-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9s-.44-.14-.62.14-.71.9-.87 1.09-.32.21-.6.07a8.13 8.13 0 01-2.39-1.47 9.06 9.06 0 01-1.67-2.07c-.17-.28 0-.43.13-.57.13-.13.28-.34.42-.51a.51.51 0 00.07-.53c-.07-.14-.62-1.49-.85-2.05s-.45-.45-.62-.46h-.53a1 1 0 00-.73.34 3.06 3.06 0 00-.95 2.29c0 1.34.97 2.63 2.77 3.59a11.09 11.09 0 004.14 1.29c.29 0 .57 0 .84-.05a2.13 2.13 0 001.37-.95c.19-.28.19-.52.13-.66s-.25-.18-.53-.32z"
                    fill="currentColor"
                  />
                </svg>
                واتساب
              </motion.button>
              
              <motion.button
                className="contact-btn messenger"
                onClick={handleMessengerClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="ماسنجر"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 0C5.373 0 0 4.925 0 11c0 3.314 1.687 6.26 4.345 8.065L3.794 24l5.233-3.053A12.01 12.01 0 0012 22c6.627 0 12-4.925 12-11S18.627 0 12 0zm0 20c-1.5 0-2.95-.3-4.25-.85L7.5 19.5l2.25-1.25C8.5 17.7 7.5 17 6.5 16c-1-1-1.5-2.25-1.5-3.5 0-4.5 3.75-8 8.5-8s8.5 3.5 8.5 8-3.75 8-8.5 8z"
                    fill="currentColor"
                  />
                </svg>
                ماسنجر
              </motion.button>
              
              <motion.button
                className="contact-btn phone"
                onClick={handlePhoneClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="اتصال مباشر"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
                    fill="currentColor"
                  />
                </svg>
                اتصل الآن
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            {t('footer.allRightsReserved')} &copy; {new Date().getFullYear()} {t('footer.tourismWebsite')}
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/about">عن الموقع</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

=======
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    const phoneNumber = '201234567890';
    const message = encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم السياحية');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/yourpage', '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:+201234567890', '_blank');
  };

  return (
    <motion.footer 
      className="main-footer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-content">
        <div className="footer-section">
          <h3>موقع السياحة</h3>
          <p>نقدم أفضل الخدمات السياحية مع ضمان الجودة والراحة</p>
          <div className="social-links">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="فيسبوك"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"
                  fill="currentColor"
                />
              </svg>
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="انستجرام"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.784 2.226 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.292 2.393 1.272 3.373.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.374-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.292-2.393-1.272-3.373-.981-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm7.2-10.406a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"
                  fill="currentColor"
                />
              </svg>
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="تويتر"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  fill="currentColor"
                />
              </svg>
            </motion.a>
          </div>
        </div>

        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul className="footer-links">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/hotels">الفنادق</Link></li>
            <li><Link to="/yachts">اليخوت</Link></li>
            <li><Link to="/about">عن الموقع</Link></li>
            <li><Link to="/privacy">سياسة الخصوصية</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>خدماتنا</h3>
          <ul className="footer-links">
            <li>حجز الفنادق</li>
            <li>حجز اليخوت</li>
            <li>جولات سياحية</li>
            <li>خدمة العملاء</li>
            <li>الدعم الفني</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t('footer.contactUs')}</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>القاهرة، مصر</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>info@tourism.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+20 123 456 7890</span>
            </div>
          </div>
          
          <div className="direct-contact">
            <h4>تواصل مباشر</h4>
            <div className="contact-buttons">
              <motion.button
                className="contact-btn whatsapp"
                onClick={handleWhatsAppClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="واتساب"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.52 3.48A12 12 0 003.48 20.52l-1.32 4.84a1 1 0 001.22 1.22l4.84-1.32A12 12 0 1020.52 3.48zm-8.52 17a10 10 0 1110-10 10 10 0 01-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9s-.44-.14-.62.14-.71.9-.87 1.09-.32.21-.6.07a8.13 8.13 0 01-2.39-1.47 9.06 9.06 0 01-1.67-2.07c-.17-.28 0-.43.13-.57.13-.13.28-.34.42-.51a.51.51 0 00.07-.53c-.07-.14-.62-1.49-.85-2.05s-.45-.45-.62-.46h-.53a1 1 0 00-.73.34 3.06 3.06 0 00-.95 2.29c0 1.34.97 2.63 2.77 3.59a11.09 11.09 0 004.14 1.29c.29 0 .57 0 .84-.05a2.13 2.13 0 001.37-.95c.19-.28.19-.52.13-.66s-.25-.18-.53-.32z"
                    fill="currentColor"
                  />
                </svg>
                واتساب
              </motion.button>
              
              <motion.button
                className="contact-btn messenger"
                onClick={handleMessengerClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="ماسنجر"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 0C5.373 0 0 4.925 0 11c0 3.314 1.687 6.26 4.345 8.065L3.794 24l5.233-3.053A12.01 12.01 0 0012 22c6.627 0 12-4.925 12-11S18.627 0 12 0zm0 20c-1.5 0-2.95-.3-4.25-.85L7.5 19.5l2.25-1.25C8.5 17.7 7.5 17 6.5 16c-1-1-1.5-2.25-1.5-3.5 0-4.5 3.75-8 8.5-8s8.5 3.5 8.5 8-3.75 8-8.5 8z"
                    fill="currentColor"
                  />
                </svg>
                ماسنجر
              </motion.button>
              
              <motion.button
                className="contact-btn phone"
                onClick={handlePhoneClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="اتصال مباشر"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
                    fill="currentColor"
                  />
                </svg>
                اتصل الآن
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            {t('footer.allRightsReserved')} &copy; {new Date().getFullYear()} {t('footer.tourismWebsite')}
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/about">عن الموقع</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

>>>>>>> 2589a0280184534f4e19ab80ae72c546f6c9d5a4
export default Footer;