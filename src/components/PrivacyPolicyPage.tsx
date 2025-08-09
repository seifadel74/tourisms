import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      icon: Shield,
      title: 'حماية البيانات',
      content: `نحن نلتزم بحماية خصوصية بياناتك الشخصية. نستخدم تقنيات تشفير متقدمة لحماية جميع المعلومات التي تشاركها معنا. لا نشارك بياناتك مع أي طرف ثالث دون موافقتك الصريحة.`
    },
    {
      icon: Lock,
      title: 'أمان المعلومات',
      content: `نطبق أعلى معايير الأمان لحماية معلوماتك. نستخدم خوادم آمنة وبروتوكولات تشفير قوية لضمان عدم وصول أي شخص غير مصرح له إلى بياناتك.`
    },
    {
      icon: Eye,
      title: 'الشفافية',
      content: `نؤمن بالشفافية الكاملة في كيفية استخدام بياناتك. يمكنك في أي وقت مراجعة وتحديث معلوماتك الشخصية أو طلب حذفها من قاعدة بياناتنا.`
    },
    {
      icon: Database,
      title: 'تخزين البيانات',
      content: `نحتفظ ببياناتك فقط طالما كانت ضرورية لتقديم خدماتنا. عند انتهاء الحاجة لها، نقوم بحذفها بشكل آمن ونهائي من جميع أنظمتنا.`
    },
    {
      icon: Users,
      title: 'حقوق المستخدم',
      content: `لديك الحق في الوصول لبياناتك وتعديلها أو حذفها في أي وقت. يمكنك أيضاً طلب نسخة من جميع البيانات التي نحتفظ بها عنك.`
    },
    {
      icon: FileText,
      title: 'التحديثات',
      content: `قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على الموقع.`
    }
  ];

  const dataTypes = [
    'الاسم الكامل',
    'عنوان البريد الإلكتروني',
    'رقم الهاتف',
    'عنوان الإقامة',
    'تفاصيل الحجز',
    'تفضيلات السفر'
  ];

  const dataUsage = [
    'تأكيد الحجوزات والدفع',
    'إرسال تأكيدات الحجز والتحديثات',
    'تقديم خدمة العملاء والدعم الفني',
    'تحسين تجربة المستخدم',
    'إرسال العروض الترويجية (بموافقتك)'
  ];

  const principles = [
    {
      title: 'الشفافية',
      description: 'نوضح بشكل واضح كيف نجمع ونستخدم بياناتك الشخصية.'
    },
    {
      title: 'الحد الأدنى من البيانات',
      description: 'لا نجمع سوى البيانات الضرورية لتقديم خدماتنا لك.'
    },
    {
      title: 'حماية البيانات',
      description: 'نستخدم أحدث تقنيات الحماية لحماية معلوماتك.'
    },
    {
      title: 'السيطرة',
      description: 'لديك سيطرة كاملة على بياناتك الشخصية في أي وقت.'
    },
    {
      title: 'الامتثال',
      description: 'نلتزم بجميع القوانين واللوائح ذات الصلة بحماية البيانات.'
    }
  ];

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
            <h1>سياسة الخصوصية</h1>
            <p>نحن نحرص على حماية خصوصية زوارنا وعملائنا. تعرف على كيفية تعاملنا مع معلوماتك الشخصية.</p>
            <p className="last-updated">آخر تحديث: 9 أغسطس 2024</p>
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
            <h2>مقدمة</h2>
            <p>نرحب بكم في موقعنا. سياسة الخصوصية هذه تشرح كيف نتعامل مع المعلومات التي نجمعها منكم عند زيارتكم لموقعنا أو استخدامكم لخدماتنا. يرجى قراءة سياسة الخصوصية هذه بعناية.</p>
          </motion.section>

          <motion.section 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2>البيانات التي نجمعها</h2>
            <p>قد نجمع الأنواع التالية من المعلومات:</p>
            
            <div className="data-types mt-6">
              <h3>معلومات الهوية</h3>
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
              <h3>كيف نستخدم معلوماتك</h3>
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
            <h2>مبادئنا في حماية البيانات</h2>
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
            <h2>التزاماتنا تجاهك</h2>
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
            <h2>اتصل بنا</h2>
            <p>إذا كان لديك أي استفسارات بخصوص سياسة الخصوصية هذه، يرجى التواصل معنا عبر:</p>
            
            <div className="contact-info mt-6">
              <div className="contact-item">
                <strong>البريد الإلكتروني:</strong>
                <span>privacy@example.com</span>
              </div>
              <div className="contact-item">
                <strong>هاتف:</strong>
                <span>+1234567890</span>
              </div>
              <div className="contact-item">
                <strong>العنوان:</strong>
                <span>شارع المدينة المنورة، الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 

