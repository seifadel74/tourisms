<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
// Import base translations
import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';
// Import filter translations
import enFilters from '../locales/en/filters.json';
import arFilters from '../locales/ar/filters.json';

type Language = 'ar' | 'en';

type NestedObject = {
  [key: string]: string | NestedObject;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  tNested: (key: string) => NestedObject;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the shape of our translations
interface Translations {
  [key: string]: any; // Allow string indexing for dynamic keys
  en: {
    [key: string]: any;
    filters: typeof enFilters;
  };
  ar: {
    [key: string]: any;
    filters: typeof arFilters;
  };
}

// Merge all translations
const translations: Translations = {
  en: {
    ...enCommon,
    filters: enFilters,
  },
  ar: {
    ...arCommon,
    filters: arFilters,
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, defaultValue?: string): string => {
    // First try to get the direct translation
    const directResult = translations[language]?.[key];
    if (directResult && typeof directResult === 'string') {
      return directResult;
    }

    // If not found, try nested lookup
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result === undefined || result === null) break;
      result = result[k];
    }
    
    return typeof result === 'string' ? result : (defaultValue || key);
  };

  const tNested = (key: string): NestedObject => {
    const value = t(key);
    return typeof value === 'object' ? value : {};
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tNested }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
=======
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.hotels': 'الفنادق',
    'nav.yachts': 'اليخوت',
    'nav.about': 'عن الموقع',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    
    // Home Page
    'home.welcome': 'مرحبًا بك في موقع السياحة',
    'home.subtitle': 'احجز فندقك أو يختك بسهولة واستمتع برحلتك!',
    'home.whyChooseUs': 'لماذا تختارنا؟',
    'home.excellentService': 'خدمة متميزة',
    'home.competitivePrices': 'أسعار تنافسية',
    'home.secureBooking': 'حجز آمن',
    'home.services': 'خدماتنا',
    'home.hotelBooking': 'حجز الفنادق',
    'home.yachtBooking': 'حجز اليخوت',
    'home.contactUs': 'تواصل معنا',
    
    // Hotel Booking
    'hotel.search': 'ابحث بالاسم أو المدينة...',
    'hotel.allCities': 'كل المدن',
    'hotel.allRatings': 'كل التقييمات',
    'hotel.allPrices': 'كل الأسعار',
    'hotel.sortResults': 'ترتيب النتائج',
    'hotel.priceLowToHigh': 'السعر: الأقل للأعلى',
    'hotel.priceHighToLow': 'السعر: الأعلى للأقل',
    'hotel.ratingHighToLow': 'التقييم: الأعلى للأقل',
    'hotel.ratingLowToHigh': 'التقييم: الأقل للأعلى',
    'hotel.noResults': 'لا توجد فنادق مطابقة لبحثك أو الفلاتر المختارة.',
    'hotel.bookNow': 'احجز الآن',
    'hotel.perNight': '/ليلة',
    'hotel.bookingInfo': 'معلومات الحجز',
    'hotel.fullName': 'الاسم الكامل:',
    'hotel.email': 'البريد الإلكتروني:',
    'hotel.phone': 'رقم الهاتف:',
    'hotel.rooms': 'عدد الغرف:',
    'hotel.guests': 'عدد الضيوف:',
    'hotel.checkIn': 'تاريخ الوصول:',
    'hotel.checkOut': 'تاريخ المغادرة:',
    'hotel.bookingSummary': 'ملخص الحجز:',
    'hotel.nights': 'عدد الليالي:',
    'hotel.totalPrice': 'السعر الإجمالي:',
    'hotel.confirmBooking': 'تأكيد الحجز',
    'hotel.sending': 'جاري الإرسال...',
    'hotel.backToSelection': 'العودة لاختيار فندق آخر',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.success': 'تم بنجاح',
    'common.error': 'حدث خطأ',
    'common.info': 'معلومات',
    'common.confirm': 'تأكيد',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.close': 'إغلاق',
    'common.yes': 'نعم',
    'common.no': 'لا',
    
    // Footer
    'footer.contactUs': 'تواصل معنا',
    'footer.allRightsReserved': 'جميع الحقوق محفوظة',
    'footer.tourismWebsite': 'موقع السياحة',
    
    // 404 Page
    'pageNotFound': 'الصفحة غير موجودة',
    'pageNotFoundDescription': 'يبدو أنك حاولت الوصول إلى صفحة غير موجودة أو تم نقلها.',
    'backToHome': 'العودة للصفحة الرئيسية',
    'goBack': 'رجوع',
    'trySearching': 'جرب البحث عن:',
    'searchHotels': 'البحث عن فنادق',
    
    // Login/Signup
    'welcomeBack': 'مرحباً بك مرة أخرى',
    'loginToAccess': 'سجل دخولك للوصول لحسابك',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'login': 'تسجيل الدخول',
    'loggingIn': 'جاري تسجيل الدخول...',
    'noAccount': 'ليس لديك حساب؟',
    'createAccount': 'إنشاء حساب جديد',
    'createNewAccount': 'إنشاء حساب جديد',
    'joinUsAndEnjoy': 'انضم إلينا واستمتع بخدماتنا المميزة',
    'fullName': 'الاسم الكامل',
    'confirmPassword': 'تأكيد كلمة المرور',
    'male': 'ذكر',
    'female': 'أنثى',
    'haveAccount': 'لديك حساب بالفعل؟',
    'creatingAccount': 'جاري إنشاء الحساب...',
    'loginSuccess': 'تم تسجيل الدخول بنجاح! 🎉',
    'loginError': 'فشل في تسجيل الدخول',
    'signupSuccess': 'تم إنشاء الحساب بنجاح! 🎉',
    'signupError': 'فشل في إنشاء الحساب',
    'passwordMismatch': 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين',
    'selectGender': 'يرجى اختيار النوع',
    'passwordTooShort': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    'scrollToTop': 'العودة للأعلى',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.hotels': 'Hotels',
    'nav.yachts': 'Yachts',
    'nav.about': 'About',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Home Page
    'home.welcome': 'Welcome to Tourism Website',
    'home.subtitle': 'Book your hotel or yacht easily and enjoy your trip!',
    'home.whyChooseUs': 'Why Choose Us?',
    'home.excellentService': 'Excellent Service',
    'home.competitivePrices': 'Competitive Prices',
    'home.secureBooking': 'Secure Booking',
    'home.services': 'Our Services',
    'home.hotelBooking': 'Hotel Booking',
    'home.yachtBooking': 'Yacht Booking',
    'home.contactUs': 'Contact Us',
    
    // Hotel Booking
    'hotel.search': 'Search by name or city...',
    'hotel.allCities': 'All Cities',
    'hotel.allRatings': 'All Ratings',
    'hotel.allPrices': 'All Prices',
    'hotel.sortResults': 'Sort Results',
    'hotel.priceLowToHigh': 'Price: Low to High',
    'hotel.priceHighToLow': 'Price: High to Low',
    'hotel.ratingHighToLow': 'Rating: High to Low',
    'hotel.ratingLowToHigh': 'Rating: Low to High',
    'hotel.noResults': 'No hotels match your search or selected filters.',
    'hotel.bookNow': 'Book Now',
    'hotel.perNight': '/night',
    'hotel.bookingInfo': 'Booking Information',
    'hotel.fullName': 'Full Name:',
    'hotel.email': 'Email:',
    'hotel.phone': 'Phone Number:',
    'hotel.rooms': 'Number of Rooms:',
    'hotel.guests': 'Number of Guests:',
    'hotel.checkIn': 'Check-in Date:',
    'hotel.checkOut': 'Check-out Date:',
    'hotel.bookingSummary': 'Booking Summary:',
    'hotel.nights': 'Number of Nights:',
    'hotel.totalPrice': 'Total Price:',
    'hotel.confirmBooking': 'Confirm Booking',
    'hotel.sending': 'Sending...',
    'hotel.backToSelection': 'Back to Hotel Selection',
    
    // Common
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.info': 'Info',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Footer
    'footer.contactUs': 'Contact Us',
    'footer.allRightsReserved': 'All Rights Reserved',
    'footer.tourismWebsite': 'Tourism Website',
    
    // 404 Page
    'pageNotFound': 'Page Not Found',
    'pageNotFoundDescription': 'It seems you tried to access a page that does not exist or has been moved.',
    'backToHome': 'Back to Home',
    'goBack': 'Go Back',
    'trySearching': 'Try searching for:',
    'searchHotels': 'Search Hotels',
    
    // Login/Signup
    'welcomeBack': 'Welcome Back',
    'loginToAccess': 'Sign in to access your account',
    'email': 'Email',
    'password': 'Password',
    'login': 'Login',
    'loggingIn': 'Logging in...',
    'noAccount': "Don't have an account?",
    'createAccount': 'Create New Account',
    'createNewAccount': 'Create New Account',
    'joinUsAndEnjoy': 'Join us and enjoy our premium services',
    'fullName': 'Full Name',
    'confirmPassword': 'Confirm Password',
    'male': 'Male',
    'female': 'Female',
    'haveAccount': 'Already have an account?',
    'creatingAccount': 'Creating account...',
    'loginSuccess': 'Login successful! 🎉',
    'loginError': 'Login failed',
    'signupSuccess': 'Account created successfully! 🎉',
    'signupError': 'Account creation failed',
    'passwordMismatch': 'Password and confirm password do not match',
    'selectGender': 'Please select gender',
    'passwordTooShort': 'Password must be at least 6 characters',
    'scrollToTop': 'Scroll to Top',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
>>>>>>> 2589a0280184534f4e19ab80ae72c546f6c9d5a4
}; 