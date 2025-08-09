import React, { useState, useEffect } from 'react';
import './HotelBooking.css';
import { fetchYachts } from '../api/yacht';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goHome?: () => void;
  showNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Sample yacht data
const mockYachts = [
  {
    id: 1,
    name: 'يخت النيل الفاخر',
    description: 'يخت فاخر على نهر النيل مع إطلالات رائعة وخدمة متميزة.',
    location: 'القاهرة، مصر',
    price: 500,
    rating: 4.8,
    capacity: 8,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    amenities: ['واي فاي', 'مطبخ', 'غرف نوم', 'حمام', 'مظلة', 'معدات صيد']
  },
  {
    id: 2,
    name: 'يخت البحر الأحمر',
    description: 'يخت فاخر في البحر الأحمر مع إمكانية الغوص والسباحة.',
    location: 'الغردقة، مصر',
    price: 800,
    rating: 4.9,
    capacity: 12,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    amenities: ['واي فاي', 'مطبخ', 'غرف نوم', 'حمام', 'معدات غوص', 'معدات صيد']
  },
  {
    id: 3,
    name: 'يخت الإسكندرية',
    description: 'يخت فاخر في ميناء الإسكندرية مع إطلالة على البحر المتوسط.',
    location: 'الإسكندرية، مصر',
    price: 600,
    rating: 4.7,
    capacity: 10,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    ],
    amenities: ['واي فاي', 'مطبخ', 'غرف نوم', 'حمام', 'تلفزيون', 'تكييف']
  }
];

const YachtBooking: React.FC<Props> = ({ goHome, showNotification }) => {
  const { t } = useLanguage();
  const [yachts, setYachts] = useState<typeof mockYachts>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYacht, setSelectedYacht] = useState<typeof mockYachts[0] | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const getYachts = async () => {
      try {
        setLoading(true);
        // Uncomment when API is ready
        // const data = await fetchYachts();
        // setYachts(data);
        setYachts(mockYachts); // Using mock data for now
      } catch (err) {
        setError('Failed to load yachts. Please try again later.');
        console.error('Error fetching yachts:', err);
      } finally {
        setLoading(false);
      }
    };

    getYachts();
  }, []);

  const handleYachtSelect = (yacht: typeof yachts[0]) => {
    setSelectedYacht(yacht);
    setCurrentImageIndex(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the booking to your backend
    console.log('Booking submitted:', { yacht: selectedYacht, ...bookingDetails });
    
    // Show success message
    toast.success('Your yacht booking has been confirmed!');
    setBookingConfirmed(true);
    
    // Notify parent component if needed
    if (showNotification) {
      showNotification('Your yacht booking has been confirmed!', 'success');
    }
  };

  const renderStars = (rating: number) => {
    return '★★★★★'.slice(0, Math.floor(rating)) + '☆☆☆☆☆'.slice(0, 5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          {t('retry')}
        </button>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="booking-confirmation">
        <h2>{t('bookingConfirmed')} 🎉</h2>
        <p>{t('bookingConfirmationMessage')}</p>
        <div className="booking-details">
          <h3>{t('bookingDetails')}</h3>
          <p><strong>{t('yacht')}:</strong> {selectedYacht?.name}</p>
          <p><strong>{t('location')}:</strong> {selectedYacht?.location}</p>
          <p><strong>{t('checkIn')}:</strong> {bookingDetails.checkIn}</p>
          <p><strong>{t('checkOut')}:</strong> {bookingDetails.checkOut}</p>
          <p><strong>{t('guests')}:</strong> {bookingDetails.guests}</p>
        </div>
        <button onClick={goHome} className="back-to-home">
          {t('backToHome')}
        </button>
      </div>
    );
  }

  if (!selectedYacht) {
    return (
      <div className="yacht-list-container">
        <h2>{t('availableYachts')}</h2>
        <div className="yacht-grid">
          {yachts.map((yacht) => (
            <div key={yacht.id} className="yacht-card">
              <div className="yacht-image" style={{ backgroundImage: `url(${yacht.images[0]})` }}></div>
              <div className="yacht-info">
                <h3>{yacht.name}</h3>
                <p className="location">{yacht.location}</p>
                <div className="rating">
                  <span className="stars">{renderStars(yacht.rating)}</span>
                  <span className="rating-number">{yacht.rating}</span>
                </div>
                <p className="description">{yacht.description}</p>
                <div className="amenities">
                  {yacht.amenities.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
                <div className="price-container">
                  <span className="price">${yacht.price}</span>
                  <span className="per-night">/ {t('perDay')}</span>
                </div>
                <button 
                  onClick={() => handleYachtSelect(yacht)}
                  className="select-button"
                >
                  {t('selectYacht')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Yacht details view
  return (
    <div className="yacht-details-container">
      <button onClick={() => setSelectedYacht(null)} className="back-button">
        &larr; {t('backToResults')}
      </button>
      
      <div className="yacht-gallery">
        <div 
          className="main-image"
          style={{ backgroundImage: `url(${selectedYacht.images[currentImageIndex]})` }}
        ></div>
        <div className="thumbnail-container">
          {selectedYacht.images.map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="yacht-info-section">
        <h1>{selectedYacht.name}</h1>
        <div className="location-rating">
          <span className="location">{selectedYacht.location}</span>
          <span className="rating">
            {renderStars(selectedYacht.rating)}
            <span className="rating-number">{selectedYacht.rating}</span>
          </span>
        </div>
        
        <div className="amenities-section">
          <h3>{t('amenities')}</h3>
          <div className="amenities-grid">
            {selectedYacht.amenities.map((amenity, index) => (
              <span key={index} className="amenity-tag-large">✓ {amenity}</span>
            ))}
          </div>
        </div>
        
        <div className="description-section">
          <h3>{t('description')}</h3>
          <p>{selectedYacht.description}</p>
        </div>
      </div>
      
      <div className="booking-form-container">
        <h2>{t('bookNow')}</h2>
        <div className="price-box">
          <span className="price">${selectedYacht.price}</span>
          <span className="per-night">/ {t('perDay')}</span>
        </div>
        
        <form onSubmit={handleSubmitBooking} className="booking-form">
          <div className="form-group">
            <label htmlFor="checkIn">{t('checkIn')} *</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={bookingDetails.checkIn}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="checkOut">{t('checkOut')} *</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={bookingDetails.checkOut}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="guests">{t('guests')} *</label>
            <select
              id="guests"
              name="guests"
              value={bookingDetails.guests}
              onChange={handleInputChange}
              required
            >
              {[...Array(selectedYacht.capacity).keys()].map(num => (
                <option key={num + 1} value={num + 1}>
                  {num + 1} {t(num === 0 ? 'guest' : 'guests')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">{t('fullName')} *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={bookingDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('email')} *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={bookingDetails.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">{t('phone')} *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={bookingDetails.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">{t('specialRequests')}</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={bookingDetails.specialRequests}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <button type="submit" className="book-now-button">
            {t('confirmBooking')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default YachtBooking;
