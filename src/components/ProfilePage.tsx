import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchUser } from '../api/user';
import { fetchUserBookings, cancelBooking } from '../api/booking';
import toast from 'react-hot-toast';
import './ProfilePage.css';

interface Booking {
  id: number;
  bookable_type: string;
  bookable?: {
    name: string;
  };
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  total_price: number;
  status: string;
  special_requests?: string;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const loadUserBookings = async () => {
    setLoadingBookings(true);
    try {
      const bookingsData = await fetchUserBookings();
      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      toast.error(t('error.loadingBookings') || 'فشل في تحميل الحجوزات');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (window.confirm(t('profile.confirmCancel') || 'هل أنت متأكد من إلغاء هذا الحجز؟')) {
      try {
        await cancelBooking(bookingId);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        toast.success(t('booking.cancelSuccess') || 'تم إلغاء الحجز بنجاح');
      } catch (error) {
        toast.error(t('error.cancelBooking') || 'حدث خطأ أثناء إلغاء الحجز');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success(t('profile.updateSuccess') || 'تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
    } catch (error) {
      toast.error(t('error.updateProfile') || 'حدث خطأ أثناء تحديث الملف الشخصي');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (!event.target) return;
        const result = event.target.result;
        if (result) {
          setFormData(prev => ({
            ...prev,
            avatar: result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        // Load user data
        const userData = await fetchUser();
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          avatar: userData.avatar || ''
        });

        // Load bookings
        await loadUserBookings();
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(t('error.loadingData') || 'حدث خطأ أثناء تحميل البيانات');
      }
    };

    loadData();
  }, [user, t]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-container">
      <motion.div 
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-header">
          <h1>{t('profile.title') || 'الملف الشخصي'}</h1>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button 
                  className="save-btn"
                  onClick={handleSave}
                >
                  <Save size={18} />
                  {t('common.save') || 'حفظ'}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  <X size={18} />
                  {t('common.cancel') || 'إلغاء'}
                </button>
              </>
            ) : (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={18} />
                {t('common.edit') || 'تعديل'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            {t('profile.profileInfo') || 'معلومات الملف الشخصي'}
          </button>
          <button 
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            {t('profile.myBookings') || 'حجوزاتي'}
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div className="profile-content">
            <div className="avatar-section">
              <div className="avatar-container">
                <img 
                  src={formData.avatar || '/default-avatar.png'} 
                  alt={t('profile.avatar') || 'صورة الملف الشخصي'}
                  className="profile-avatar"
                />
                {isEditing && (
                  <label className="avatar-upload-btn">
                    <Camera size={20} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="profile-details">
              <div className="form-group">
                <label><User size={18} /> {t('profile.name') || 'الاسم'}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('profile.namePlaceholder') || 'أدخل الاسم'}
                  />
                ) : (
                  <p>{formData.name || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label><Mail size={18} /> {t('profile.email') || 'البريد الإلكتروني'}</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('profile.emailPlaceholder') || 'أدخل البريد الإلكتروني'}
                  />
                ) : (
                  <p>{formData.email || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label><Phone size={18} /> {t('profile.phone') || 'رقم الهاتف'}</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('profile.phonePlaceholder') || 'أدخل رقم الهاتف'}
                  />
                ) : (
                  <p>{formData.phone || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label><MapPin size={18} /> {t('profile.address') || 'العنوان'}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('profile.addressPlaceholder') || 'أدخل العنوان'}
                  />
                ) : (
                  <p>{formData.address || '-'}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bookings-container">
            {loadingBookings ? (
              <div className="loading">
                {t('common.loading') || 'جاري التحميل...'}
              </div>
            ) : bookings.length === 0 ? (
              <div className="no-bookings">
                {t('profile.noBookings') || 'لا توجد حجوزات'}
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h3>{booking.bookable?.name || t('booking.booking') || 'حجز'}</h3>
                      <span className={`status ${booking.status.toLowerCase()}`}>
                        {booking.status === 'confirmed' 
                          ? t('booking.confirmed') || 'تم التأكيد'
                          : t('booking.pending') || 'قيد الانتظار'}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p>
                        <strong>{t('booking.checkIn') || 'تاريخ الوصول'}:</strong> {new Date(booking.check_in_date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>{t('booking.checkOut') || 'تاريخ المغادرة'}:</strong> {new Date(booking.check_out_date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>{t('booking.guests') || 'عدد الضيوف'}:</strong> {booking.guests_count}
                      </p>
                      <p>
                        <strong>{t('booking.totalPrice') || 'السعر الإجمالي'}:</strong> {booking.total_price} {t('common.currency') || 'ريال'}
                      </p>
                      {booking.special_requests && (
                        <p>
                          <strong>{t('booking.specialRequests') || 'طلبات خاصة'}:</strong> {booking.special_requests}
                        </p>
                      )}
                    </div>
                    {booking.status === 'confirmed' && (
                      <div className="booking-actions">
                        <button 
                          className="cancel-booking-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          {t('booking.cancelBooking') || 'إلغاء الحجز'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
