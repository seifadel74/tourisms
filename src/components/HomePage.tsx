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
    toast.success(t('hotel.redirecting', 'Redirecting to hotels...'));
    navigate('/hotels');
  };

  const handleYachtClick = () => {
    toast.success(t('yacht.redirecting', 'Redirecting to yachts...'));
    navigate('/yachts');
  };

  const features = [
    {
      icon: '🌟',
      title: t('home.excellentService', 'Excellent Service'),
      description: t('home.excellentServiceDesc', 'We provide the best services with guaranteed quality and comfort')
    },
    {
      icon: '💰',
      title: t('home.competitivePrices', 'Competitive Prices'),
      description: t('home.competitivePricesDesc', 'Best prices with exclusive offers and special discounts')
    },
    {
      icon: '🛡️',
      title: t('home.secureBooking', 'Secure Booking'),
      description: t('home.secureBookingDesc', 'Safe and guaranteed booking with 24/7 technical support')
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
          <h1>{t('home.welcome', 'Welcome to Tourism')}</h1>
          <p className="hero-subtitle">
            {t('home.subtitle', 'Book your hotel or yacht easily and enjoy your trip!')}
          </p>
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
                {t('common.getStarted', 'Get Started')}
              </motion.button>
              <motion.button
                className="hero-btn secondary"
                onClick={() => navigate('/about')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('common.learnMore', 'Learn More')}
              </motion.button>
            </motion.div>
          )}
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="features-section"
          ref={ref1}
          initial={{ opacity: 0, y: 50 }}
          animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>{t('home.whyChooseUs', 'Why Choose Us?')}</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section 
          className="services-section"
          ref={ref2}
          initial={{ opacity: 0, y: 50 }}
          animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>{t('home.ourServices', 'Our Services')}</h2>
          <div className="services-grid">
            <motion.div 
              className="service-card hotel"
              onClick={handleHotelClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <h3>{t('home.hotelBooking', 'Hotel Booking')}</h3>
              <p>{t('home.hotelBookingDesc', 'Find and book the best hotels at competitive prices')}</p>
              <button className="service-btn">
                {t('common.bookNow', 'Book Now')} →
              </button>
            </motion.div>
            <motion.div 
              className="service-card yacht"
              onClick={handleYachtClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <h3>{t('home.yachtBooking', 'Yacht Booking')}</h3>
              <p>{t('home.yachtBookingDesc', 'Rent luxury yachts for an unforgettable experience')}</p>
              <button className="service-btn">
                {t('common.bookNow', 'Book Now')} →
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="contact-section"
          ref={ref4}
          initial={{ opacity: 0, y: 50 }}
          animate={inView4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>{t('contact.title', 'Contact Us')}</h2>
          <div className="contact-info">
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="contact-icon">📞</span>
              <span>{t('contact.phone', '+20 123 456 7890')}</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="contact-icon">📧</span>
              <span>{t('contact.email', 'info@tourism.com')}</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              animate={inView4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="contact-icon">📍</span>
              <span>{t('contact.location', 'Cairo, Egypt')}</span>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;
