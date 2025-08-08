<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const bg = document.querySelector('.parallax-bg') as HTMLElement;
      if (bg) {
        const y = window.scrollY * 0.3;
        bg.style.transform = `translateY(${y}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleHotelClick = () => {
    toast.success('جاري الانتقال لصفحة حجز الفنادق...');
    navigate('/hotels');
  };

  const handleYachtClick = () => {
    toast.success('جاري الانتقال لصفحة حجز اليخوت...');
    navigate('/yachts');
  };

  const features = [
    {
      icon: '🌟',
      title: t('home.excellentService'),
      description: 'نقدم أفضل الخدمات مع ضمان الجودة والراحة'
    },
    {
      icon: '💰',
      title: t('home.competitivePrices'),
      description: 'أفضل الأسعار مع عروض حصرية وخصومات خاصة'
    },
    {
      icon: '🛡️',
      title: t('home.secureBooking'),
      description: 'حجز آمن ومضمون مع دعم فني على مدار الساعة'
    }
  ];

  return (
    <div style={{position: 'relative'}}>
      <div className="parallax-bg" />
      <div className="home-container">
        {/* Hero Section */}
        <motion.section 
          className={`hero-section ${isVisible ? 'fade-in' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>{t('home.welcome')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          {!isAuthenticated && (
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                className="hero-btn primary"
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ابدأ الآن
              </motion.button>
              <motion.button
                className="hero-btn secondary"
                onClick={() => navigate('/about')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تعرف علينا
              </motion.button>
            </motion.div>
          )}
        </motion.section>

        {/* Features Section */}
        <motion.section 
          ref={ref1}
          className={`features-section ${isVisible ? 'slide-up' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('home.whyChooseUs')}</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services Preview */}
        <motion.section 
          ref={ref2}
          className={`services-preview ${isVisible ? 'slide-up' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('home.services')}</h2>
          <div className="services-grid">
            <motion.div 
              className="service-card hotel-card"
              onClick={handleHotelClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="service-image hotel-image"></div>
              <div className="service-content">
                <h3>{t('home.hotelBooking')}</h3>
                <p>اختر من بين أفضل الفنادق الفاخرة والاقتصادية</p>
                <motion.button 
                  className="service-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {t('hotel.bookNow')}
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              className="service-card yacht-card"
              onClick={handleYachtClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="service-image yacht-image"></div>
              <div className="service-content">
                <h3>{t('home.yachtBooking')}</h3>
                <p>استمتع برحلات بحرية فاخرة على أجمل اليخوت</p>
                <motion.button 
                  className="service-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {t('hotel.bookNow')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          ref={ref3}
          className="stats-section"
          initial={{ opacity: 0, y: 50 }}
          animate={inView3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="stats-grid">
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="stat-number">50,000+</div>
              <div className="stat-label">عميل راضي</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="stat-number">100+</div>
              <div className="stat-label">وجهة سياحية</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="stat-number">4.8</div>
              <div className="stat-label">تقييم متوسط</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="stat-number">24/7</div>
              <div className="stat-label">دعم فني</div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          ref={ref4}
          className={`contact-section ${isVisible ? 'slide-up' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={inView4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('home.contactUs')}</h2>
          <div className="contact-info">
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="contact-icon">📞</span>
              <span>+20 123 456 7890</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="contact-icon">📧</span>
              <span>info@tourism.com</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="contact-icon">📍</span>
              <span>القاهرة، مصر</span>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const bg = document.querySelector('.parallax-bg') as HTMLElement;
      if (bg) {
        const y = window.scrollY * 0.3;
        bg.style.transform = `translateY(${y}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleHotelClick = () => {
    toast.success('جاري الانتقال لصفحة حجز الفنادق...');
    navigate('/hotels');
  };

  const handleYachtClick = () => {
    toast.success('جاري الانتقال لصفحة حجز اليخوت...');
    navigate('/yachts');
  };

  const features = [
    {
      icon: '🌟',
      title: t('home.excellentService'),
      description: 'نقدم أفضل الخدمات مع ضمان الجودة والراحة'
    },
    {
      icon: '💰',
      title: t('home.competitivePrices'),
      description: 'أفضل الأسعار مع عروض حصرية وخصومات خاصة'
    },
    {
      icon: '🛡️',
      title: t('home.secureBooking'),
      description: 'حجز آمن ومضمون مع دعم فني على مدار الساعة'
    }
  ];

  return (
    <div style={{position: 'relative'}}>
      <div className="parallax-bg" />
      <div className="home-container">
        {/* Hero Section */}
        <motion.section 
          className={`hero-section ${isVisible ? 'fade-in' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>{t('home.welcome')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          {!isAuthenticated && (
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                className="hero-btn primary"
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ابدأ الآن
              </motion.button>
              <motion.button
                className="hero-btn secondary"
                onClick={() => navigate('/about')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تعرف علينا
              </motion.button>
            </motion.div>
          )}
        </motion.section>

        {/* Features Section */}
        <motion.section 
          ref={ref1}
          className={`features-section ${isVisible ? 'slide-up' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('home.whyChooseUs')}</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services Preview */}
        <motion.section 
          ref={ref2}
          className={`services-preview ${isVisible ? 'slide-up' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('home.services')}</h2>
          <div className="services-grid">
            <motion.div 
              className="service-card hotel-card"
              onClick={handleHotelClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="service-image hotel-image"></div>
              <div className="service-content">
                <h3>{t('home.hotelBooking')}</h3>
                <p>اختر من بين أفضل الفنادق الفاخرة والاقتصادية</p>
                <motion.button 
                  className="service-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {t('hotel.bookNow')}
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              className="service-card yacht-card"
              onClick={handleYachtClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="service-image yacht-image"></div>
              <div className="service-content">
                <h3>{t('home.yachtBooking')}</h3>
                <p>استمتع برحلات بحرية فاخرة على أجمل اليخوت</p>
                <motion.button 
                  className="service-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {t('hotel.bookNow')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          ref={ref3}
          className="stats-section"
          initial={{ opacity: 0, y: 50 }}
          animate={inView3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="stats-grid">
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="stat-number">50,000+</div>
              <div className="stat-label">عميل راضي</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="stat-number">100+</div>
              <div className="stat-label">وجهة سياحية</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="stat-number">4.8</div>
              <div className="stat-label">تقييم متوسط</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView3 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="stat-number">24/7</div>
              <div className="stat-label">دعم فني</div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          ref={ref4}
          className={`contact-section ${isVisible ? 'slide-up' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={inView4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('home.contactUs')}</h2>
          <div className="contact-info">
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="contact-icon">📞</span>
              <span>+20 123 456 7890</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="contact-icon">📧</span>
              <span>info@tourism.com</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="contact-icon">📍</span>
              <span>القاهرة، مصر</span>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

>>>>>>> 2589a0280184534f4e19ab80ae72c546f6c9d5a4
export default HomePage;