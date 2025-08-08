<<<<<<< HEAD
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
    'معالجة الحجوزات',
    'تقديم خدمة العملاء',
    'إرسال تأكيدات الحجز',
    'تحسين خدماتنا',
    'إرسال عروض خاصة (بموافقتك)',
    'الامتثال للقوانين المعمول بها'
  ];

  return (
    <div className="privacy-container">
      <motion.div
        className="privacy-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <h1>سياسة الخصوصية</h1>
          <p>نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية</p>
          <div className="last-updated">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>
      </motion.div>

      <div className="privacy-content">
        <div className="container">
          {/* Introduction */}
          <motion.section
            className="intro-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>مقدمة</h2>
            <p>
              نحن في موقع السياحة ندرك أهمية خصوصية بياناتك الشخصية ونلتزم بحمايتها. 
              هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام خدماتنا.
            </p>
            <p>
              باستخدام موقعنا، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة. 
              إذا كنت لا توافق على هذه السياسة، يرجى عدم استخدام خدماتنا.
            </p>
          </motion.section>

          {/* Data Collection */}
          <motion.section
            className="data-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>البيانات التي نجمعها</h2>
            <div className="data-types">
              <h3>البيانات الشخصية:</h3>
              <ul>
                {dataTypes.map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
            </div>
            <div className="data-usage">
              <h3>كيفية استخدام البيانات:</h3>
              <ul>
                {dataUsage.map((usage, index) => (
                  <li key={index}>{usage}</li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Privacy Principles */}
          <motion.section
            className="principles-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2>مبادئ الخصوصية</h2>
            <div className="principles-grid">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  className="principle-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <section.icon size={40} className="principle-icon" />
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Cookies */}
          <motion.section
            className="cookies-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2>ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. هذه الملفات تساعدنا في:
            </p>
            <ul>
              <li>تذكر تفضيلاتك</li>
              <li>تحليل حركة المرور على الموقع</li>
              <li>تحسين أداء الموقع</li>
              <li>تقديم محتوى مخصص</li>
            </ul>
            <p>
              يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
            </p>
          </motion.section>

          {/* Third Parties */}
          <motion.section
            className="third-parties-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2>الأطراف الثالثة</h2>
            <p>
              لا نبيع أو نؤجر أو نشارك بياناتك الشخصية مع أطراف ثالثة لأغراض تجارية. 
              قد نشارك معلومات محدودة مع شركائنا في الخدمة (مثل الفنادق واليخوت) 
              فقط لغرض إتمام حجزك.
            </p>
            <p>
              قد نستخدم خدمات أطراف ثالثة لتحليل البيانات أو معالجة المدفوعات، 
              وهذه الخدمات ملزمة بمعايير الخصوصية الصارمة.
            </p>
          </motion.section>

          {/* Contact */}
          <motion.section
            className="contact-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2>تواصل معنا</h2>
            <p>
              إذا كان لديك أي أسئلة حول سياسة الخصوصية أو تريد ممارسة حقوقك، 
              يمكنك التواصل معنا:
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>البريد الإلكتروني:</strong>
                <span>privacy@tourism.com</span>
              </div>
              <div className="contact-item">
                <strong>الهاتف:</strong>
                <span>+20 123 456 7890</span>
              </div>
              <div className="contact-item">
                <strong>العنوان:</strong>
                <span>123 شارع النيل، القاهرة، مصر</span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
=======
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();

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
    'معالجة الحجوزات',
    'تقديم خدمة العملاء',
    'إرسال تأكيدات الحجز',
    'تحسين خدماتنا',
    'إرسال عروض خاصة (بموافقتك)',
    'الامتثال للقوانين المعمول بها'
  ];

  return (
    <div className="privacy-container">
      <motion.div
        className="privacy-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <h1>سياسة الخصوصية</h1>
          <p>نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية</p>
          <div className="last-updated">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>
      </motion.div>

      <div className="privacy-content">
        <div className="container">
          {/* Introduction */}
          <motion.section
            className="intro-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>مقدمة</h2>
            <p>
              نحن في موقع السياحة ندرك أهمية خصوصية بياناتك الشخصية ونلتزم بحمايتها. 
              هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام خدماتنا.
            </p>
            <p>
              باستخدام موقعنا، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة. 
              إذا كنت لا توافق على هذه السياسة، يرجى عدم استخدام خدماتنا.
            </p>
          </motion.section>

          {/* Data Collection */}
          <motion.section
            className="data-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>البيانات التي نجمعها</h2>
            <div className="data-types">
              <h3>البيانات الشخصية:</h3>
              <ul>
                {dataTypes.map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
            </div>
            <div className="data-usage">
              <h3>كيفية استخدام البيانات:</h3>
              <ul>
                {dataUsage.map((usage, index) => (
                  <li key={index}>{usage}</li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Privacy Principles */}
          <motion.section
            className="principles-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2>مبادئ الخصوصية</h2>
            <div className="principles-grid">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  className="principle-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <section.icon size={40} className="principle-icon" />
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Cookies */}
          <motion.section
            className="cookies-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2>ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. هذه الملفات تساعدنا في:
            </p>
            <ul>
              <li>تذكر تفضيلاتك</li>
              <li>تحليل حركة المرور على الموقع</li>
              <li>تحسين أداء الموقع</li>
              <li>تقديم محتوى مخصص</li>
            </ul>
            <p>
              يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
            </p>
          </motion.section>

          {/* Third Parties */}
          <motion.section
            className="third-parties-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2>الأطراف الثالثة</h2>
            <p>
              لا نبيع أو نؤجر أو نشارك بياناتك الشخصية مع أطراف ثالثة لأغراض تجارية. 
              قد نشارك معلومات محدودة مع شركائنا في الخدمة (مثل الفنادق واليخوت) 
              فقط لغرض إتمام حجزك.
            </p>
            <p>
              قد نستخدم خدمات أطراف ثالثة لتحليل البيانات أو معالجة المدفوعات، 
              وهذه الخدمات ملزمة بمعايير الخصوصية الصارمة.
            </p>
          </motion.section>

          {/* Contact */}
          <motion.section
            className="contact-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2>تواصل معنا</h2>
            <p>
              إذا كان لديك أي أسئلة حول سياسة الخصوصية أو تريد ممارسة حقوقك، 
              يمكنك التواصل معنا:
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>البريد الإلكتروني:</strong>
                <span>privacy@tourism.com</span>
              </div>
              <div className="contact-item">
                <strong>الهاتف:</strong>
                <span>+20 123 456 7890</span>
              </div>
              <div className="contact-item">
                <strong>العنوان:</strong>
                <span>123 شارع النيل، القاهرة، مصر</span>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 
>>>>>>> 2589a0280184534f4e19ab80ae72c546f6c9d5a4
