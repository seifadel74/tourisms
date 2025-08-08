<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Shield, Star, Users, Globe, Award } from 'lucide-react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { icon: Users, number: '50,000+', label: 'عميل راضي' },
    { icon: Globe, number: '100+', label: 'وجهة سياحية' },
    { icon: Star, number: '4.8', label: 'تقييم متوسط' },
    { icon: Award, number: '15+', label: 'جائزة سياحية' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'الاهتمام بالعميل',
      description: 'نضع راحة وسعادة عملائنا في المقام الأول ونقدم لهم أفضل الخدمات الممكنة'
    },
    {
      icon: Shield,
      title: 'الأمان والموثوقية',
      description: 'نضمن حجوزات آمنة ومضمونة مع حماية كاملة لبيانات العملاء'
    },
    {
      icon: Star,
      title: 'الجودة المتميزة',
      description: 'نختار بعناية أفضل الفنادق واليخوت لضمان تجربة سياحية فريدة'
    }
  ];

  const team = [
    {
      name: 'أحمد محمد',
      position: 'المدير التنفيذي',
      image: 'https://via.placeholder.com/150',
      description: 'خبرة 15 عام في مجال السياحة'
    },
    {
      name: 'فاطمة علي',
      position: 'مدير العمليات',
      image: 'https://via.placeholder.com/150',
      description: 'متخصصة في إدارة الخدمات السياحية'
    },
    {
      name: 'محمد حسن',
      position: 'مدير التطوير',
      image: 'https://via.placeholder.com/150',
      description: 'خبير في تطوير المنصات السياحية'
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
          <h1>عن موقع السياحة</h1>
          <p>نحن نقدم أفضل الخدمات السياحية منذ أكثر من 10 سنوات، نساعدك في تخطيط رحلتك المثالية</p>
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
          <h2>إحصائياتنا</h2>
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
              <h2>قصتنا</h2>
              <p>
                بدأت رحلتنا في عام 2014 عندما قررنا إنشاء منصة سياحية تجمع بين سهولة الاستخدام 
                والجودة العالية. كنا نؤمن بأن السفر يجب أن يكون تجربة ممتعة وليس مصدر قلق.
              </p>
              <p>
                على مر السنين، وسعنا خدماتنا لتشمل حجز الفنادق الفاخرة واليخوت المميزة، 
                مع التركيز على تقديم تجربة شخصية لكل عميل. نحن نفخر بكوننا شريكك الموثوق في رحلاتك.
              </p>
            </div>
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" alt="فريق العمل" />
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
          <h2>قيمنا</h2>
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
          <h2>فريق العمل</h2>
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
          <h2>تواصل معنا</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>العنوان</h3>
              <p>123 شارع النيل، القاهرة، مصر</p>
            </div>
            <div className="contact-item">
              <h3>الهاتف</h3>
              <p>+20 123 456 7890</p>
            </div>
            <div className="contact-item">
              <h3>البريد الإلكتروني</h3>
              <p>info@tourism.com</p>
            </div>
            <div className="contact-item">
              <h3>ساعات العمل</h3>
              <p>الأحد - الخميس: 9:00 ص - 6:00 م</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

=======
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
    { icon: Users, number: '50,000+', label: 'عميل راضي' },
    { icon: Globe, number: '100+', label: 'وجهة سياحية' },
    { icon: Star, number: '4.8', label: 'تقييم متوسط' },
    { icon: Award, number: '15+', label: 'جائزة سياحية' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'الاهتمام بالعميل',
      description: 'نضع راحة وسعادة عملائنا في المقام الأول ونقدم لهم أفضل الخدمات الممكنة'
    },
    {
      icon: Shield,
      title: 'الأمان والموثوقية',
      description: 'نضمن حجوزات آمنة ومضمونة مع حماية كاملة لبيانات العملاء'
    },
    {
      icon: Star,
      title: 'الجودة المتميزة',
      description: 'نختار بعناية أفضل الفنادق واليخوت لضمان تجربة سياحية فريدة'
    }
  ];

  const team = [
    {
      name: 'أحمد محمد',
      position: 'المدير التنفيذي',
      image: 'https://via.placeholder.com/150',
      description: 'خبرة 15 عام في مجال السياحة'
    },
    {
      name: 'فاطمة علي',
      position: 'مدير العمليات',
      image: 'https://via.placeholder.com/150',
      description: 'متخصصة في إدارة الخدمات السياحية'
    },
    {
      name: 'محمد حسن',
      position: 'مدير التطوير',
      image: 'https://via.placeholder.com/150',
      description: 'خبير في تطوير المنصات السياحية'
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
          <h1>عن موقع السياحة</h1>
          <p>نحن نقدم أفضل الخدمات السياحية منذ أكثر من 10 سنوات، نساعدك في تخطيط رحلتك المثالية</p>
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
          <h2>إحصائياتنا</h2>
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
              <h2>قصتنا</h2>
              <p>
                بدأت رحلتنا في عام 2014 عندما قررنا إنشاء منصة سياحية تجمع بين سهولة الاستخدام 
                والجودة العالية. كنا نؤمن بأن السفر يجب أن يكون تجربة ممتعة وليس مصدر قلق.
              </p>
              <p>
                على مر السنين، وسعنا خدماتنا لتشمل حجز الفنادق الفاخرة واليخوت المميزة، 
                مع التركيز على تقديم تجربة شخصية لكل عميل. نحن نفخر بكوننا شريكك الموثوق في رحلاتك.
              </p>
            </div>
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" alt="فريق العمل" />
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
          <h2>قيمنا</h2>
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
          <h2>فريق العمل</h2>
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
          <h2>تواصل معنا</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>العنوان</h3>
              <p>123 شارع النيل، القاهرة، مصر</p>
            </div>
            <div className="contact-item">
              <h3>الهاتف</h3>
              <p>+20 123 456 7890</p>
            </div>
            <div className="contact-item">
              <h3>البريد الإلكتروني</h3>
              <p>info@tourism.com</p>
            </div>
            <div className="contact-item">
              <h3>ساعات العمل</h3>
              <p>الأحد - الخميس: 9:00 ص - 6:00 م</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

>>>>>>> 2589a0280184534f4e19ab80ae72c546f6c9d5a4
export default AboutPage; 