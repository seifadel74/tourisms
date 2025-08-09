import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Shield, Star, Users, Globe, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { icon: Users, number: '50,000+', label: t('about.stats.clients') },
    { icon: Globe, number: '100+', label: t('about.stats.destinations') },
    { icon: Star, number: '4.8', label: t('about.stats.rating') },
    { icon: Award, number: '15+', label: t('about.stats.awards') }
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.values.customerCare.title'),
      description: t('about.values.customerCare.description')
    },
    {
      icon: Shield,
      title: t('about.values.security.title'),
      description: t('about.values.security.description')
    },
    {
      icon: Star,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    }
  ];

  const team = [
    {
      name: t('about.team.member1.name'),
      position: t('about.team.member1.position'),
      image: 'https://via.placeholder.com/150',
      description: t('about.team.member1.description')
    },
    {
      name: t('about.team.member2.name'),
      position: t('about.team.member2.position'),
      image: 'https://via.placeholder.com/150',
      description: t('about.team.member2.description')
    },
    {
      name: t('about.team.member3.name'),
      position: t('about.team.member3.position'),
      image: 'https://via.placeholder.com/150',
      description: t('about.team.member3.description')
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <motion.section 
        className="about-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <h1>{t('about.hero.title')}</h1>
          <p>{t('about.hero.subtitle')}</p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        ref={ref1}
        className="stats-section"
        initial={{ opacity: 0, y: 50 }}
        animate={inView1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <h2>{t('about.stats.title')}</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView1 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <stat.icon size={40} className="stat-icon" />
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        ref={ref2}
        className="story-section"
        initial={{ opacity: 0, y: 50 }}
        animate={inView2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>{t('about.story.title')}</h2>
              <p>{t('about.story.paragraph1')}</p>
              <p>{t('about.story.paragraph2')}</p>
            </div>
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" alt={t('about.story.imageAlt')} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        ref={ref3}
        className="values-section"
        initial={{ opacity: 0, y: 50 }}
        animate={inView3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <h2>{t('about.values.title')}</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <value.icon size={50} className="value-icon" />
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        ref={ref4}
        className="team-section"
        initial={{ opacity: 0, y: 50 }}
        animate={inView4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <h2>{t('about.team.title')}</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView4 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <img src={member.image} alt={member.name} className="team-image" />
                <h3>{member.name}</h3>
                <p className="team-position">{member.position}</p>
                <p className="team-description">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="contact-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="container">
          <h2>{t('about.contact.title')}</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>{t('about.contact.address.title')}</h3>
              <p>{t('about.contact.address.value')}</p>
            </div>
            <div className="contact-item">
              <h3>{t('about.contact.phone.title')}</h3>
              <p>{t('about.contact.phone.value')}</p>
            </div>
            <div className="contact-item">
              <h3>{t('about.contact.email.title')}</h3>
              <p>{t('about.contact.email.value')}</p>
            </div>
            <div className="contact-item">
              <h3>{t('about.contact.hours.title')}</h3>
              <p>{t('about.contact.hours.value')}</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
