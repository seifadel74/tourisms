import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import './YachtBooking.css';
import { fetchYachts } from '../api/yacht';

interface Props {
  goHome?: () => void;
  showNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Sample yacht data
const mockYachts = [
  {
    id: 1,
    name: 'يخت النيل الفاخر',
    description: 'يخت فاخر على نهر النيل مع إطلالات رائعة وخدمة متميزة. يوفر تجربة فريدة للاستمتاع بجمال النيل وسحر القاهرة التاريخية.',
    location: 'القاهرة، مصر',
    price: 500,
    rating: 4.8,
    capacity: 8,
    length: '25 متر',
    crew: 4,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'
    ],
    amenities: ['واي فاي مجاني', 'مطبخ كامل', '3 غرف نوم', '2 حمام', 'مظلة شمسية', 'معدات صيد', 'نظام صوتي', 'تكييف']
  },
  {
    id: 2,
    name: 'يخت البحر الأحمر',
    description: 'يخت فاخر في البحر الأحمر مع إمكانية الغوص والسباحة. مثالي لاستكشاف الشعاب المرجانية الخلابة والحياة البحرية المذهلة.',
    location: 'الغردقة، مصر',
    price: 800,
    rating: 4.9,
    capacity: 12,
    length: '30 متر',
    crew: 6,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
    ],
    amenities: ['واي فاي مجاني', 'مطبخ كامل', '4 غرف نوم', '3 حمام', 'معدات غوص', 'معدات صيد', 'جاكوزي', 'بار', 'منصة سباحة']
  },
  {
    id: 3,
    name: 'يخت الإسكندرية',
    description: 'يخت فاخر في ميناء الإسكندرية مع إطلالة على البحر المتوسط. يجمع بين الأناقة الكلاسيكية والراحة العصرية لتجربة بحرية لا تُنسى.',
    location: 'الإسكندرية، مصر',
    price: 600,
    rating: 4.7,
    capacity: 10,
    length: '28 متر',
    crew: 5,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
    ],
    amenities: ['واي فاي مجاني', 'مطبخ كامل', '3 غرف نوم', '2 حمام', 'تلفزيون ذكي', 'تكييف', 'صالون فاخر', 'تراس علوي']
  },
  {
    id: 4,
    name: 'يخت شرم الشيخ الملكي',
    description: 'يخت ملكي فاخر في شرم الشيخ مع أفضل المرافق والخدمات. مثالي للرحلات العائلية والمناسبات الخاصة مع إطلالات خلابة على خليج نعمة.',
    location: 'شرم الشيخ، مصر',
    price: 950,
    rating: 4.9,
    capacity: 16,
    length: '35 متر',
    crew: 8,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'
    ],
    amenities: ['واي فاي عالي السرعة', 'مطبخ شيف', '5 غرف نوم', '4 حمام', 'جاكوزي', 'معدات غوص', 'معدات صيد', 'بار كامل', 'صالة سينما', 'هليباد']
  }
];

const YachtBooking: React.FC<Props> = ({ goHome, showNotification }) => {
  const { t, language } = useLanguage();
  const [yachts, setYachts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYacht, setSelectedYacht] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Translate common Arabic amenity phrases to English when language = 'en'
  const translateAmenity = (amenity: string): string => {
    if (language !== 'en') return amenity;
    const a = amenity.trim();
    // Numeric patterns
    const bedrooms = a.match(/(\d+)\s*غرف?\s*نوم/);
    if (bedrooms) return `${bedrooms[1]} bedrooms`;
    const bathrooms = a.match(/(\d+)\s*حمام/);
    if (bathrooms) return `${bathrooms[1]} bathrooms`;
    // Specific phrases
    if (a.includes('واي فاي عالي السرعة')) return 'High-speed Wi‑Fi';
    if (a.includes('واي فاي')) return 'Free Wi‑Fi';
    if (a.includes('مطبخ شيف')) return "Chef's kitchen";
    if (a.includes('مطبخ كامل')) return 'Full kitchen';
    if (a.includes('معدات غوص')) return 'Diving equipment';
    if (a.includes('معدات صيد')) return 'Fishing gear';
    if (a.includes('جاكوزي')) return 'Jacuzzi';
    if (a.includes('بار كامل')) return 'Full bar';
    if (a === 'بار') return 'Bar';
    if (a.includes('منصة سباحة')) return 'Swim platform';
    if (a.includes('تلفزيون ذكي')) return 'Smart TV';
    if (a.includes('صالة سينما')) return 'Cinema lounge';
    if (a.includes('صالون فاخر')) return 'Luxury salon';
    if (a.includes('تراس علوي')) return 'Upper deck';
    if (a.includes('هليباد')) return 'Helipad';
    if (a.includes('نظام صوتي')) return 'Sound system';
    if (a.includes('مظلة شمسية')) return 'Sunshade';
    if (a.includes('تكييف')) return 'Air conditioning';
    // Fallback: return original
    return amenity;
  };

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
      toast.error(t('booking.bookingError', 'Please fill in all required fields'));
      return;
    }

    // Here you would typically send the booking to your backend
    console.log('Booking submitted:', { yacht: selectedYacht, ...bookingDetails });
    
    // Show success message
    toast.success(t('booking.bookingConfirmed', 'Booking Confirmed'));
    setShowConfirmation(true);
    
    // Notify parent component if needed
    if (showNotification) {
      showNotification(t('booking.bookingConfirmed', 'Booking Confirmed'), 'success');
    }
  };

  const renderStars = (rating: number) => {
    return '★★★★★'.slice(0, Math.floor(rating)) + '☆☆☆☆☆'.slice(0, 5 - Math.floor(rating));
  };

  // Filter and sort yachts
  const filteredYachts = yachts.filter(yacht => {
    // Filter by location
    if (filterLocation && !yacht.location.toLowerCase().includes(filterLocation.toLowerCase())) {
      return false;
    }
    
    // Filter by rating
    if (filterRating && yacht.rating < parseFloat(filterRating)) {
      return false;
    }
    
    // Filter by price
    if (filterPrice) {
      const [min, max] = filterPrice.split('-').map(Number);
      if (yacht.price < min || yacht.price > max) {
        return false;
      }
    }
    
    // Filter by capacity
    if (filterCapacity && yacht.capacity < parseInt(filterCapacity)) {
      return false;
    }
    
    // Search by name or location
    if (search && !yacht.name.toLowerCase().includes(search.toLowerCase()) && 
        !yacht.location.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort yachts
  const sortedYachts = [...filteredYachts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'capacity':
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="booking-confirmation">
        <h2>{t('booking.bookingConfirmed')} 🎉</h2>
        <p>{t('booking.bookingConfirmationMessage')}</p>
        <div className="booking-details">
          <h3>{t('booking.bookingDetails')}</h3>
          <p><strong>{t('booking.yacht')}:</strong> {selectedYacht?.name}</p>
          <p><strong>{t('booking.location')}:</strong> {selectedYacht?.location}</p>
          <p><strong>{t('booking.checkIn')}:</strong> {bookingDetails.checkIn}</p>
          <p><strong>{t('booking.checkOut')}:</strong> {bookingDetails.checkOut}</p>
          <p><strong>{t('booking.guests')}:</strong> {bookingDetails.guests}</p>
        </div>
        <button onClick={goHome} className="back-to-home">
          {t('common.backToHome')}
        </button>
      </div>
    );
  }

  if (!selectedYacht) {
    return (
      <div className="yacht-list-container">
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              placeholder={t('search.yachts')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="search-icon">🔍</i>
          </div>
          
          <div className="filter-group">
            <label>{t('filterOptions.filterBy')}</label>
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
              <option value="">{t('filterOptions.allLocations')}</option>
              {Array.from(new Set(yachts.map(yacht => yacht.location.split('،')[0].trim())))
                .filter(Boolean)
                .map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
            </select>
            
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="">{t('filterOptions.allRatings')}</option>
              <option value="4.5">{t('filterOptions.ratingFourHalf')}</option>
              <option value="4">{t('filterOptions.ratingFour')}</option>
              <option value="3">{t('filterOptions.ratingThree')}</option>
            </select>
            
            <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
              <option value="">{t('filterOptions.allPrices')}</option>
              <option value="0-300">{t('filterOptions.lessThan300')}</option>
              <option value="300-600">{t('filterOptions.range300to600')}</option>
              <option value="600-1000">{t('filterOptions.range600to1000')}</option>
              <option value="1000-10000">{t('filterOptions.moreThan1000')}</option>
            </select>
            
            <select value={filterCapacity} onChange={(e) => setFilterCapacity(e.target.value)}>
              <option value="">{t('filterOptions.allCapacities')}</option>
              <option value="4">{t('filterOptions.fourPlusPersons')}</option>
              <option value="6">{t('filterOptions.sixPlusPersons')}</option>
              <option value="8">{t('filterOptions.eightPlusPersons')}</option>
              <option value="10">{t('filterOptions.tenPlusPersons')}</option>
            </select>
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">{t('filterOptions.sortBy')}</option>
              <option value="price_asc">{t('filterOptions.priceAsc')}</option>
              <option value="price_desc">{t('filterOptions.priceDesc')}</option>
              <option value="rating">{t('filterOptions.highestRated')}</option>
              <option value="capacity">{t('filterOptions.largestCapacity')}</option>
            </select>
          </div>
        </div>
        
        <h2>{t('common.availableYachts')}</h2>
        <div className="yacht-grid">
          {sortedYachts.length > 0 ? (
            sortedYachts.map((yacht) => (
            <div key={yacht.id} className="yacht-card fade-in-up" onClick={() => handleYachtSelect(yacht)}>
              <div className="yacht-image-container">
                <img src={yacht.images[0]} alt={yacht.name} className="yacht-card-image" />
                <div className="yacht-price">{yacht.price} {t('common.perDay')}</div>
              </div>
              <div className="yacht-card-content">
                <h3>{yacht.name}</h3>
                <p className="yacht-location">📍 {yacht.location}</p>
                <div className="yacht-rating">
                  <span className="stars">{renderStars(yacht.rating)}</span>
                  <span className="rating-number">({yacht.rating})</span>
                </div>
                <div className="yacht-capacity">
                  <h4>{t('booking.capacitySpecs')}</h4>
                  <div className="capacity-details">
                    <span className="capacity-tag">👥 {yacht.capacity} {t('booking.person')}</span>
                    <span className="capacity-tag">📏 {yacht.length}</span>
                    <span className="capacity-tag">⚓ {yacht.crew} {t('booking.crew')}</span>
                  </div>
                </div>
                <p className="yacht-description">{yacht.description}</p>
                <div className="yacht-amenities">
                  {yacht.amenities.slice(0, 6).map((amenity: string, index: number) => (
                    <span key={index} className="yacht-amenity-tag">{translateAmenity(amenity)}</span>
                  ))}
                  {yacht.amenities.length > 6 && (
                    <span className="yacht-amenity-tag">+{yacht.amenities.length - 6} {t('common.more')}</span>
                  )}
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="no-results">
              <p>{t('search.noResults')}</p>
              <button onClick={() => {
                setFilterLocation('');
                setFilterRating('');
                setFilterPrice('');
                setFilterCapacity('');
                setSearch('');
                setSortBy('');
              }}>
                {t('search.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Yacht details view
  return (
    <div className="yacht-details-container">
      <button onClick={() => setSelectedYacht(null)} className="back-button">
        &larr; {t('common.backToResults')}
      </button>
      
      <div className="yacht-gallery">
        <div 
          className="main-image"
          style={{ backgroundImage: `url(${selectedYacht.images[currentImageIndex]})` }}
        >
          <button
            type="button"
            className="gallery-nav prev"
            onClick={() => setCurrentImageIndex((idx) => (idx - 1 + selectedYacht.images.length) % selectedYacht.images.length)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery-nav next"
            onClick={() => setCurrentImageIndex((idx) => (idx + 1) % selectedYacht.images.length)}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="image-counter">{currentImageIndex + 1} / {selectedYacht.images.length}</div>
        </div>
        <div className="thumbnail-container">
          {selectedYacht.images.map((img: string, index: number) => (
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
        
        <div className="yacht-capacity-large">
          <h4>{t('common.specifications')}:</h4>
          <div className="yacht-specs">
            <div className="spec-item">
              <span className="spec-label">👥 {t('common.capacity')}:</span>
              <span className="spec-value">{selectedYacht.capacity} {t(selectedYacht.capacity === 1 ? 'booking.person' : 'booking.persons')}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">📏 {t('booking.length')}:</span>
              <span className="spec-value">{language === 'en' ? String(selectedYacht.length).replace('متر', 'm').trim() : selectedYacht.length}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">⚓ {t('booking.crew')}:</span>
              <span className="spec-value">{selectedYacht.crew} {t('booking.crewMembers')}</span>
            </div>
          </div>
        </div>
        
        <div className="yacht-amenities-large">
          <h3>{t('common.amenitiesServices', t('booking.amenities', 'Amenities'))}</h3>
          <div className="amenities-grid">
            {selectedYacht.amenities.map((amenity: string, index: number) => (
              <span key={index} className="amenity-tag-large">✓ {translateAmenity(amenity)}</span>
            ))}
          </div>
        </div>
        
        <div className="description-section">
          <h3>{t('common.description')}</h3>
          <p>{selectedYacht.description}</p>
        </div>
      </div>
      
      <div className="booking-form-container">
        <h2>{t('bookingSummary')}</h2>
        <div className="price-box">
          <span className="price">${selectedYacht.price}</span>
          <span className="per-night">/ {t('common.perDay')}</span>
        </div>
        
        <form onSubmit={handleSubmitBooking} className="booking-form">
          <div className="form-group">
            <label htmlFor="checkIn">{t('booking.checkIn', 'Check In')} *</label>
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
            <label htmlFor="checkOut">{t('booking.checkOut', 'Check Out')} *</label>
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
            <label htmlFor="guests">{t('booking.guests', 'Guests')} *</label>
            <select
              id="guests"
              name="guests"
              value={bookingDetails.guests}
              onChange={handleInputChange}
              required
            >
              {[...Array(selectedYacht.capacity).keys()].map(num => (
                <option key={num + 1} value={num + 1}>
                  {num + 1} {t(num === 0 ? 'booking.person' : 'booking.persons')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">{t('booking.fullName', 'Full Name')} *</label>
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
            <label htmlFor="email">{t('booking.email', 'Email')} *</label>
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
            <label htmlFor="phone">{t('booking.phone', 'Phone')} *</label>
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
            <label htmlFor="specialRequests">{t('booking.specialRequests', 'Special Requests')}</label>
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
