import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './TermsOfServicePage.css';

const TermsOfServicePage: React.FC = () => {
  const { t, language } = useLanguage();

  const containerDir = language === 'ar' ? 'rtl' : 'ltr';

  const sectionAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Active section handling for TOC highlighting
  const [activeId, setActiveId] = React.useState<string>('intro');
  const sectionIds = React.useMemo(
    () => ['intro', 'acceptance', 'responsibilities', 'bookings', 'prohibited', 'liability', 'changes', 'contact'],
    []
  );
  const tocRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRootRef = React.useRef<HTMLElement | Window | null>(null);

  // Find nearest scrollable ancestor
  const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
    if (!node) return window;
    let p: HTMLElement | null = node.parentElement;
    while (p && p !== document.body) {
      const { overflowY } = window.getComputedStyle(p);
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') return p;
      p = p.parentElement;
    }
    return window;
  };

  // Initialize scroll root once mounted
  React.useEffect(() => {
    const root = getScrollParent(tocRef.current);
    scrollRootRef.current = root;
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: scrollRootRef.current instanceof Window ? null : (scrollRootRef.current as HTMLElement | null),
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  // Keep the active TOC chip visible inside the horizontal scroller
  React.useEffect(() => {
    const container = tocRef.current;
    if (!container || !activeId) return;
    const link = container.querySelector(`a[href="#${activeId}"]`) as HTMLElement | null;
    if (link && typeof link.scrollIntoView === 'function') {
      link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeId]);

  return (
    <div className={`terms-page terms-container`} dir={containerDir}>
      {/* In-page navigation first */}
      <nav aria-label="Sections" className="terms-nav">
        <div className="terms-toc" ref={tocRef}>
          <a href="#responsibilities" className="terms-chip" aria-current={activeId === 'responsibilities' ? 'true' : undefined}>{t('terms.userResponsibilities.title', 'مسؤوليات المستخدم')}</a>
          <a href="#bookings" className="terms-chip" aria-current={activeId === 'bookings' ? 'true' : undefined}>{t('terms.bookings.title', 'الحجوزات والدفع')}</a>
          <a href="#prohibited" className="terms-chip" aria-current={activeId === 'prohibited' ? 'true' : undefined}>{t('terms.prohibited.title', 'الاستخدامات المحظورة')}</a>
          <a href="#liability" className="terms-chip" aria-current={activeId === 'liability' ? 'true' : undefined}>{t('terms.liability.title', 'حدود المسؤولية')}</a>
          <a href="#changes" className="terms-chip" aria-current={activeId === 'changes' ? 'true' : undefined}>{t('terms.changes.title', 'التغييرات على الشروط')}</a>
          <a href="#contact" className="terms-chip" aria-current={activeId === 'contact' ? 'true' : undefined}>{t('terms.contact.title', 'تواصل معنا')}</a>
        </div>
      </nav>

      {/* Hero merged into Intro section below */}

      <div className="terms-grid">
        <motion.section
          id="intro"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          {/* Merged hero content */}
          <div className="terms-hero-title-row">
            <FileText className="terms-primary" size={28} />
            <h1 className="terms-hero-title">
              {t('terms.hero.title', 'مقدمة')}
            </h1>
          </div>
          <p className="terms-hero-subtitle">
            {t('terms.hero.subtitle', 'نظرة عامة و تمهيد لاستخدام المنصة')}
          </p>
          <p className="terms-hero-updated">
            {t('terms.hero.lastUpdated', 'آخر تحديث: 15 أغسطس 2025')}
          </p>

          {/* Intro body merged without separate subsection header */}
          <p className="terms-text">
            {t('terms.intro.text', 'باستخدامك لمنصتنا، فإنك توافق على الالتزام بهذه الشروط. في حال عدم موافقتك، يرجى التوقف عن استخدام المنصة فوراً.')}
          </p>
        </motion.section>

        <motion.section
          id="acceptance"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          <div className="terms-section-title-row">
            <CheckCircle2 className="terms-primary" size={22} />
            <h2 className="terms-section-title">{t('terms.acceptance.title', 'قبول الشروط')}</h2>
          </div>
          <p className="terms-text">
            {t('terms.acceptance.content', 'باستخدامك للخدمات، فإنك تؤكد أنك قرأت وفهمت وتوافق على الالتزام بهذه الشروط وجميع السياسات المرتبطة بها.')}
          </p>
        </motion.section>

        <motion.section
          id="responsibilities"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          <div className="terms-section-title-row">
            <ShieldCheck className="terms-primary" size={22} />
            <h2 className="terms-section-title">{t('terms.userResponsibilities.title', 'مسؤوليات المستخدم')}</h2>
          </div>
          <ul className="terms-list list-logical">
            <li>{t('terms.userResponsibilities.item1', 'تقديم معلومات دقيقة وحديثة عند إنشاء الحساب والحجز.')}</li>
            <li>{t('terms.userResponsibilities.item2', 'عدم إساءة استخدام المنصة أو الخدمات أو محاولة الوصول غير المصرح به.')}</li>
            <li>{t('terms.userResponsibilities.item3', 'الالتزام بجميع القوانين واللوائح المعمول بها.')}</li>
          </ul>
        </motion.section>

        <motion.section
          id="bookings"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          <div className="terms-section-title-row">
            <FileText className="terms-primary" size={22} />
            <h2 className="terms-section-title">{t('terms.bookings.title', 'الحجوزات والدفع')}</h2>
          </div>
          <ul className="terms-list list-logical">
            <li>{t('terms.bookings.item1', 'جميع الحجوزات خاضعة للتأكيد. قد نطلب معلومات إضافية لإتمام الحجز.')}</li>
            <li>{t('terms.bookings.item2', 'قد يتم تطبيق رسوم أو سياسات إلغاء وفقاً لمزود الخدمة المختار.')}</li>
            <li>{t('terms.bookings.item3', 'أنت مسؤول عن التأكد من صحة تفاصيل الحجز قبل الإرسال.')}</li>
          </ul>
        </motion.section>

        <motion.section
          id="prohibited"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          <div className="terms-section-title-row">
            <AlertTriangle className="terms-primary" size={22} />
            <h2 className="terms-section-title">{t('terms.prohibited.title', 'الاستخدامات المحظورة')}</h2>
          </div>
          <ul className="terms-list list-logical">
            <li>{t('terms.prohibited.item1', 'أي نشاط قد يلحق الضرر بالمنصة أو المستخدمين الآخرين.')}</li>
            <li>{t('terms.prohibited.item2', 'جمع البيانات أو محاولة اختراق الأنظمة.')}</li>
            <li>{t('terms.prohibited.item3', 'استخدام المحتوى لأغراض غير قانونية.')}</li>
          </ul>
        </motion.section>

        <motion.section
          id="liability"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          <div className="terms-section-title-row">
            <ShieldCheck className="terms-primary" size={22} />
            <h2 className="terms-section-title">{t('terms.liability.title', 'حدود المسؤولية')}</h2>
          </div>
          <p className="terms-text">
            {t('terms.liability.content', 'لا نتحمل المسؤولية عن أي خسائر غير مباشرة أو تبعية ناشئة عن استخدام المنصة أو الخدمات، إلى الحد الذي يسمح به القانون.')}
          </p>
        </motion.section>

        <motion.section
          id="changes"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          <div className="terms-section-title-row">
            <Info className="terms-primary" size={22} />
            <h2 className="terms-section-title">{t('terms.changes.title', 'التغييرات على الشروط')}</h2>
          </div>
          <p className="terms-text">
            {t('terms.changes.content', 'قد نقوم بتحديث هذه الشروط من حين لآخر. يسري أي تحديث بمجرد نشره على هذه الصفحة.')}
          </p>
        </motion.section>

        <motion.section
          id="contact"
          className="terms-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionAnim}
        >
          <div className="terms-section-title-row">
            <Info className="terms-primary" size={22} />
            <h2 className="terms-section-title">{t('terms.contact.title', 'تواصل معنا')}</h2>
          </div>
          <p className="terms-text">
            {t('terms.contact.intro', 'للاستفسارات المتعلقة بشروط الخدمة، تواصل معنا عبر:')}
          </p>
          <ul className="terms-contact-list">
            <li>{t('terms.contact.email', 'support@example.com')}</li>
            <li>{t('terms.contact.phone', '+201234567890')}</li>
          </ul>
        </motion.section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
