import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';
import './PrivacyPolicyPage.css';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();

  const sectionKeys = ['protection', 'security', 'transparency', 'storage', 'rights', 'updates'] as const;
  const sectionIcons = [Shield, Lock, Eye, Database, Users, FileText] as const;
  const sections = sectionKeys.map((key, idx) => ({
    icon: sectionIcons[idx],
    title: t(`privacy.sections.${key}.title`,
      ['حماية البيانات','أمان المعلومات','الشفافية','تخزين البيانات','حقوق المستخدم','التحديثات'][idx]
    ),
    content: t(`privacy.sections.${key}.content`, '')
  }));

  const dataTypesKeys = ['item1','item2','item3','item4','item5','item6'] as const;
  const dataTypes = dataTypesKeys.map((k, i) => t(`privacy.dataTypes.${k}`,
    ['الاسم الكامل','البريد الإلكتروني','رقم الهاتف','عنوان الإقامة','تفاصيل الحجز','تفضيلات السفر'][i]
  ));

  const dataUsageKeys = ['item1','item2','item3','item4','item5'] as const;
  const dataUsage = dataUsageKeys.map((k, i) => t(`privacy.dataUsage.${k}`,
    ['تأكيد الحجوزات والدفع','إرسال تأكيدات الحجز والتحديثات','تقديم خدمة العملاء والدعم الفني','تحسين تجربة المستخدم','إرسال العروض الترويجية (بموافقتك)'][i]
  ));

  const principlesKeys = ['p1','p2','p3','p4','p5'] as const;
  const principles = principlesKeys.map((k, i) => ({
    title: t(`privacy.principles.${k}.title`,
      ['الشفافية','الحد الأدنى','حماية البيانات','السيطرة','الامتثال'][i]
    ),
    description: t(`privacy.principles.${k}.description`,
      [
        'نوضح بشكل واضح كيف نجمع ونستخدم بياناتك الشخصية.',
        'لا نجمع سوى البيانات الضرورية لتقديم خدماتنا.',
        'نستخدم أحدث تقنيات الحماية للحفاظ على معلوماتك.',
        'لديك سيطرة كاملة على بياناتك في أي وقت.',
        'نلتزم بالقوانين واللوائح ذات الصلة بحماية البيانات.'
      ][i]
    )
  }));

  return (
    <div className="privacy-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="privacy-hero"
      >
        <div className="container">
          <motion.div 
            initial={{ y: -20 }} 
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-content"
          >
            <h1>{t('privacy.hero.title', 'سياسة الخصوصية')}</h1>
            <p>{t('privacy.hero.subtitle', 'نحن نحرص على حماية خصوصية زوارنا وعملائنا. تعرف على كيفية تعاملنا مع معلوماتك الشخصية.')}</p>
            <p className="last-updated">{t('privacy.hero.lastUpdated', 'آخر تحديث: 9 أغسطس 2024')}</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="privacy-content">
        <div className="container">
          <motion.section 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2>{t('privacy.intro.title', 'مقدمة')}</h2>
            <p>{t('privacy.intro.text', 'نرحب بكم في موقعنا. سياسة الخصوصية هذه تشرح كيف نتعامل مع المعلومات التي نجمعها منكم عند زيارتكم لموقعنا أو استخدامكم لخدماتنا. يرجى قراءة سياسة الخصوصية هذه بعناية.')}</p>
          </motion.section>

          <motion.section 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2>{t('privacy.headings.dataTypes', 'البيانات التي نجمعها')}</h2>
            <p>{t('privacy.headings.dataTypesIntro', 'قد نجمع الأنواع التالية من المعلومات:')}</p>
            
            <div className="data-types mt-6">
              <h3>{t('privacy.headings.identityInfo', 'معلومات الهوية')}</h3>
              <ul>
                {dataTypes.map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="data-usage mt-8">
              <h3>{t('privacy.headings.usage', 'كيف نستخدم معلوماتك')}</h3>
              <ul>
                {dataUsage.map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + dataTypes.length) }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          <motion.section 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2>{t('privacy.headings.principles', 'مبادئنا في حماية البيانات')}</h2>
            <div className="principles-grid mt-6">
              {principles.map((principle, index) => (
                <motion.div 
                  key={index}
                  className="principle-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="principle-icon">
                    <Shield size={32} />
                  </div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2>{t('privacy.headings.commitments', 'التزاماتنا تجاهك')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index + 0.4 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="text-blue-500 mb-4">
                    <section.icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
                  <p className="text-gray-600">{section.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="contact-section"
          >
            <h2>{t('privacy.contact.title', 'اتصل بنا')}</h2>
            <p>{t('privacy.contact.intro', 'إذا كان لديك أي استفسارات بخصوص سياسة الخصوصية هذه، يرجى التواصل معنا عبر:')}</p>
            
            <div className="contact-info mt-6">
              <div className="contact-item">
                <strong>{t('booking.email', 'البريد الإلكتروني')}:</strong>
                <span>{t('privacy.contact.email', 'privacy@example.com')}</span>
              </div>
              <div className="contact-item">
                <strong>{t('booking.phone', 'هاتف')}:</strong>
                <span>{t('privacy.contact.phone', '+1234567890')}</span>
              </div>
              <div className="contact-item">
                <strong>{t('about.contact.address.title', 'العنوان')}:</strong>
                <span>{t('privacy.contact.address', 'شارع المدينة المنورة، الرياض، المملكة العربية السعودية')}</span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 

