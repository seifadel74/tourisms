import React, { useState, useEffect } from 'react';
import './HotelBooking.css';
import { fetchHotels } from '../api/hotel';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goHome?: () => void;
  showNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  price_per_night?: number;
  rating: number;
  images: string[];
  amenities: string[];
  description: string;
  city?: string;
}

// Map amenities to simple icons (supports Arabic/English keywords)
const getAmenityIcon = (amenity: string): string => {
  const a = amenity.toLowerCase();
  // Arabic
  if (a.includes('واي') || a.includes('wifi') || a.includes('wi-fi')) return '📶';
  if (a.includes('لا نهائي') || a.includes('infinity')) return '♾️';
  if (a.includes('مسبح') || a.includes('pool')) return '🏊‍♂️';
  if (a.includes('مطعم') || a.includes('restaurant') || a.includes('بار') || a.includes('bar')) return '🍽️';
  if (a.includes('سبا') || a.includes('spa')) return '💆';
  if (a.includes('صالة رياضية') || a.includes('gym') || a.includes('لياقة')) return '🏋️';
  if (a.includes('موقف') || a.includes('سيارات') || a.includes('parking')) return '🅿️';
  if (a.includes('شاطئ') || a.includes('beach')) return '🏖️';
  if (a.includes('إطلالة') || a.includes('view')) return '🌄';
  if (a.includes('خدمة الغرف') || a.includes('room service')) return '🛎️';
  if (a.includes('نقل') || a.includes('shuttle') || a.includes('transfer')) return '🚌';
  if (a.includes('تراس') || a.includes('terrace') || a.includes('حديقة') || a.includes('garden')) return '🌿';
  if (a.includes('غوص') || a.includes('diving') || a.includes('snorkel')) return '🤿';
  if (a.includes('أطفال') || a.includes('kids')) return '🧒';
  if (a.includes('مركز تجاري') || a.includes('business center')) return '🖥️';
  if (a.includes('كافيه') || a.includes('cafe') || a.includes('coffee')) return '☕';
  if (a.includes('كونسيرج') || a.includes('concierge')) return '🎩';
  if (a.includes('رحلات') || a.includes('نيلية') || a.includes('boat') || a.includes('cruise')) return '🚤';
  return '•';
};

// Map common amenity labels (Arabic/English variants) to a unified key
const AMENITY_MAP: Record<string, string> = {
  'واي فاي مجاني': 'wifi',
  'Wi-Fi': 'wifi',
  'Wifi': 'wifi',
  'WiFi': 'wifi',
  'مسبح': 'pool',
  'Pool': 'pool',
  'مسبح لا نهائي': 'infinityPool',
  'Infinity Pool': 'infinityPool',
  'مطعم': 'restaurant',
  'Restaurant': 'restaurant',
  'موقف سيارات': 'parking',
  'Parking': 'parking',
  'صالة رياضية': 'gym',
  'Gym': 'gym',
  'سبا': 'spa',
  'Spa': 'spa',
  'خدمة الغرف': 'roomService',
  'Room Service': 'roomService',
  'شاطئ': 'beach',
  'شاطئ خاص': 'privateBeach',
  'Beach': 'beach',
  'Private Beach': 'privateBeach',
  'إطلالة': 'view',
  'View': 'view',
  'خدمة النقل': 'shuttle',
  'Shuttle': 'shuttle',
  'تراس': 'terrace',
  'Terrace': 'terrace',
  'حديقة': 'garden',
  'Garden': 'garden',
  'بار': 'bar',
  'Bar': 'bar',
  'غوص': 'diving',
  'Diving': 'diving',
  'نادي أطفال': 'kidsClub',
  'Kids Club': 'kidsClub',
  'مركز تجاري': 'businessCenter',
  'Business Center': 'businessCenter',
  'كافيه': 'cafe',
  'Cafe': 'cafe',
  'خدمة الكونسيرج': 'concierge',
  'Concierge': 'concierge',
  'رحلات نيلية': 'boatTours',
  'Boat Tours': 'boatTours'
};

const amenityKeyFromText = (text: string): string | null => {
  if (!text) return null;
  // Exact match first
  if (AMENITY_MAP[text]) return AMENITY_MAP[text];
  // Loose contains fallback
  const lower = text.toLowerCase();
  if (lower.includes('wifi') || lower.includes('wi-fi') || text.includes('واي فاي')) return 'wifi';
  if (lower.includes('infinity') || text.includes('لا نهائي')) return 'infinityPool';
  if (lower.includes('pool') || text.includes('مسبح')) return 'pool';
  if (lower.includes('restaurant') || text.includes('مطعم')) return 'restaurant';
  if (lower.includes('parking') || text.includes('موقف')) return 'parking';
  if (lower.includes('gym') || lower.includes('fitness') || text.includes('صالة رياضية')) return 'gym';
  if (lower.includes('spa') || text.includes('سبا')) return 'spa';
  if ((lower.includes('room') && lower.includes('service')) || text.includes('خدمة الغرف')) return 'roomService';
  if (lower.includes('private beach') || text.includes('شاطئ خاص')) return 'privateBeach';
  if (lower.includes('beach') || text.includes('شاطئ')) return 'beach';
  if (lower.includes('view') || text.includes('إطلالة')) return 'view';
  if (lower.includes('shuttle') || lower.includes('transfer') || text.includes('نقل')) return 'shuttle';
  if (lower.includes('terrace') || text.includes('تراس')) return 'terrace';
  if (lower.includes('garden') || text.includes('حديقة')) return 'garden';
  if (lower.includes('bar') || text.includes('بار')) return 'bar';
  if (lower.includes('diving') || lower.includes('snorkel') || text.includes('غوص')) return 'diving';
  if (lower.includes('kids') || text.includes('أطفال')) return 'kidsClub';
  if (lower.includes('business') || text.includes('مركز تجاري')) return 'businessCenter';
  if (lower.includes('cafe') || lower.includes('coffee') || text.includes('كافيه')) return 'cafe';
  if (lower.includes('concierge') || text.includes('كونسيرج')) return 'concierge';
  if (lower.includes('boat') || lower.includes('cruise') || text.includes('رحلات نيلية')) return 'boatTours';
  return null;
};

const amenityLabel = (text: string, tFn?: (k: string) => string): string => {
  const key = amenityKeyFromText(text);
  const translate = tFn || (() => text);
  return key ? translate(`amenities.${key}`) : text;
};

const HotelBooking: React.FC<Props> = ({ goHome, showNotification }) => {
  const { t } = useLanguage();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [filterCity, setFilterCity] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample hotel data
  const mockHotels: Hotel[] = [
    {
      id: 1,
      name: 'فندق قصر النيل',
      location: 'القاهرة، مصر',
      price: 1200,
      rating: 4.5,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'
      ],
      amenities: ['واي فاي مجاني', 'مسبح', 'مطعم', 'موقف سيارات', 'صالة رياضية', 'سبا', 'خدمة الغرف'],
      description: 'فندق فاخر يطل على النيل مع إطلالات بانورامية رائعة وخدمة ممتازة. يوفر تجربة إقامة لا تُنسى مع مرافق عالمية المستوى.'
    },
    {
      id: 2,
      name: 'منتجع البحر الأحمر',
      location: 'الغردقة، مصر',
      price: 800,
      rating: 4.2,
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'
      ],
      amenities: ['شاطئ خاص', 'غوص', 'مطعم', 'بار', 'واي فاي مجاني', 'مسبح لا نهائي', 'نادي أطفال'],
      description: 'منتجع ساحلي رائع مع شاطئ خاص وأنشطة مائية متنوعة. يقع على ساحل البحر الأحمر الخلاب مع شعاب مرجانية مذهلة.'
    },
    {
      id: 3,
      name: 'فندق الأهرامات الذهبي',
      location: 'الجيزة، مصر',
      price: 950,
      rating: 4.3,
      images: [
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'
      ],
      amenities: ['إطلالة على الأهرامات', 'مطعم', 'مسبح', 'واي فاي مجاني', 'خدمة النقل', 'مركز تجاري', 'تراس'],
      description: 'فندق تاريخي مع إطلالة مباشرة على أهرامات الجيزة. يجمع بين الفخامة الحديثة والتراث المصري العريق.'
    },
    {
      id: 4,
      name: 'فندق الإسكندرية الملكي',
      location: 'الإسكندرية، مصر',
      price: 700,
      rating: 4.1,
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'
      ],
      amenities: ['إطلالة بحرية', 'مطعم', 'كافيه', 'واي فاي مجاني', 'موقف سيارات', 'خدمة الكونسيرج'],
      description: 'فندق أنيق على كورنيش الإسكندرية مع إطلالة رائعة على البحر المتوسط وقرب من المعالم التاريخية.'
    },
    {
      id: 5,
      name: 'منتجع أسوان النوبي',
      location: 'أسوان، مصر',
      price: 600,
      rating: 4.4,
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80'
      ],
      amenities: ['إطلالة على النيل', 'مطعم نوبي', 'رحلات نيلية', 'واي فاي مجاني', 'حديقة', 'مسبح'],
      description: 'منتجع فريد يجمع بين الضيافة النوبية الأصيلة والراحة العصرية على ضفاف النيل في أسوان الساحرة.'
    }
  ];

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setIsLoading(true);
        // Uncomment when API is ready
        // const data = await fetchHotels();
        // setHotels(data);
        setHotels(mockHotels); // Using mock data for now
      } catch (error) {
        console.error('Error loading hotels:', error);
        toast.error(t('errorLoadingHotels'));
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, [t]);

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentImageIndex(0);
    // Smoothly scroll to top when entering details view
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {}
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHotel) return;
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the booking to your backend
      // const response = await bookHotel({
      //   hotelId: selectedHotel.id,
      //   name,
      //   email,
      //   phone,
      //   checkIn,
      //   checkOut,
      //   rooms,
      //   guests
      // });
      
      // Mock response for now
      const mockResponse = {
        success: true,
        bookingId: `BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };
      
      if (mockResponse.success) {
        setBookingId(mockResponse.bookingId);
        setBookingConfirmed(true);
        toast.success(t('booking.bookingConfirmed'));
        
        if (showNotification) {
          showNotification(t('booking.bookingConfirmed'), 'success');
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(t('booking.bookingError'));
      
      if (showNotification) {
        showNotification(t('booking.bookingError'), 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★★★★★'.slice(0, Math.floor(rating)) + '☆☆☆☆☆'.slice(0, 5 - Math.floor(rating));
  };

  const calcNights = (): number => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn).getTime();
    const outDate = new Date(checkOut).getTime();
    const diff = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  const filteredHotels = hotels.filter(hotel => {
    // Filter by city
    if (filterCity && !hotel.location.includes(filterCity)) {
      return false;
    }
    
    // Filter by rating
    if (filterRating && hotel.rating < parseFloat(filterRating)) {
      return false;
    }
    
    // Filter by price
    if (filterPrice) {
      const [min, max] = filterPrice.split('-').map(Number);
      const price = hotel.price_per_night || hotel.price;
      if (price < min || price > max) {
        return false;
      }
    }
    
    // Search by name or location
    if (search && !hotel.name.toLowerCase().includes(search.toLowerCase()) && 
        !hotel.location.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort hotels
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return (a.price_per_night || a.price) - (b.price_per_night || b.price);
      case 'price_desc':
        return (b.price_per_night || b.price) - (a.price_per_night || a.price);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="hotel-list-container">
        <div className="filters-container skeleton-filters"></div>
        <div className="hotels-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="hotel-card skeleton-card">
              <div className="hotel-image-container">
                <div className="skeleton skeleton-image" />
              </div>
              <div className="hotel-card-content">
                <div className="skeleton skeleton-line skeleton-title" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-chip-row">
                  <span className="skeleton skeleton-chip" />
                  <span className="skeleton skeleton-chip" />
                  <span className="skeleton skeleton-chip" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="booking-confirmation">
        <h2>{t('booking.bookingConfirmed')} 🎉</h2>
        <p>{t('booking.bookingConfirmationMessage')}</p>
        <div className="booking-details">
          <h3>{t('booking.bookingDetails')}</h3>
          <p><strong>{t('booking.email')}:</strong> {email}</p>
          <p><strong>{t('booking.hotel')}:</strong> {selectedHotel?.name}</p>
          <p><strong>{t('booking.location')}:</strong> {selectedHotel?.location}</p>
          <p><strong>{t('booking.checkIn')}:</strong> {checkIn}</p>
          <p><strong>{t('booking.checkOut')}:</strong> {checkOut}</p>
          <p><strong>{t('booking.guests')}:</strong> {guests}</p>
          <p><strong>{t('booking.rooms')}:</strong> {rooms}</p>
        </div>
        <button onClick={goHome} className="back-to-home">
          {t('common.backToHome')}
        </button>
      </div>
    );
  }

  if (!selectedHotel) {
    return (
      <div className="hotel-list-container">
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              placeholder={t('booking.searchHotels')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="search-icon">🔍</i>
          </div>
          
          <div className="filter-group">
            <label>{t('booking.filterBy')}:</label>
            <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
              <option value="">{t('booking.allCities')}</option>
              {Array.from(new Set(hotels.map(hotel => hotel.city || hotel.location.split('،')[0].trim())))
                .filter(Boolean)
                .map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
            
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="">{t('filterOptions.allRatings')}</option>
              <option value="4.5">4.5+ ★</option>
              <option value="4">4+ ★</option>
              <option value="3">3+ ★</option>
            </select>
            
            <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
              <option value="">{t('filterOptions.allPrices')}</option>
              <option value="0-500">{t('filterOptions.lessThan500')}</option>
              <option value="500-1000">{t('filterOptions.range500to1000')}</option>
              <option value="1000-2000">{t('filterOptions.range1000to2000')}</option>
              <option value="2000-10000">{t('filterOptions.moreThan2000')}</option>
            </select>
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">{t('booking.sortBy')}</option>
              <option value="price_asc">{t('booking.priceLowToHigh')}</option>
              <option value="price_desc">{t('booking.priceHighToLow')}</option>
              <option value="rating">{t('booking.topRated')}</option>
            </select>
          </div>
        </div>
        
        <h2>{t('common.availableHotels')}</h2>
        <div className="hotels-grid">
          {sortedHotels.length > 0 ? (
            sortedHotels.map(hotel => (
              <div key={hotel.id} className="hotel-card fade-in-up" onClick={() => handleHotelSelect(hotel)}>
                <div className="hotel-image-container">
                  <img src={hotel.images[0]} alt={hotel.name} className="hotel-card-image" />
                  <div className="image-overlay"></div>
                  <div className="hotel-price">{(hotel.price_per_night || hotel.price)} {t('common.perNight')}</div>
                  <div className="rating-badge">★ {hotel.rating.toFixed(1)}</div>
                </div>
                <div className="hotel-card-content">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-location">📍 {hotel.location}</p>
                  <div className="hotel-rating">
                    <span className="stars">{renderStars(hotel.rating)}</span>
                    <span className="rating-number">({hotel.rating})</span>
                  </div>
                  <p className="hotel-description">{hotel.description}</p>
                  <div className="hotel-amenities">
                    {hotel.amenities.slice(0, 6).map((amenity, index) => (
                      <span key={index} className="amenity-tag"><span className="amenity-ico">{getAmenityIcon(amenity)}</span> {amenityLabel(amenity, t)}</span>
                    ))}
                    {hotel.amenities.length > 6 && (
                      <span className="amenity-tag">+{hotel.amenities.length - 6} {t('common.more')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>{t('search.noResults')}</p>
              <button onClick={() => {
                setFilterCity('');
                setFilterRating('');
                setFilterPrice('');
                setSearch('');
              }}>
                {t('search.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Hotel details and booking form
  return (
    <div className="hotel-details-container">
      <button 
        onClick={() => setSelectedHotel(null)} 
        className="back-button"
      >
        &larr; {t('common.backToResults')}
      </button>
      
      <div className="hotel-gallery">
        <div 
          className="main-image"
          style={{ backgroundImage: `url(${selectedHotel.images[currentImageIndex]})` }}
        >
          <button
            type="button"
            className="gallery-nav prev"
            onClick={() => setCurrentImageIndex((idx) => (idx - 1 + selectedHotel.images.length) % selectedHotel.images.length)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery-nav next"
            onClick={() => setCurrentImageIndex((idx) => (idx + 1) % selectedHotel.images.length)}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="image-counter">{currentImageIndex + 1} / {selectedHotel.images.length}</div>
        </div>
        <div className="thumbnail-container">
          {selectedHotel.images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
              onClick={() => setCurrentImageIndex(index)}
            />
            ))}
          </div>
        </div>
      
      <div className="hotel-info-section">
        <h1>{selectedHotel.name}</h1>
        <div className="location-rating">
          <span className="location">{selectedHotel.location}</span>
          <span className="rating">
            {renderStars(selectedHotel.rating)}
            <span className="rating-number">{selectedHotel.rating.toFixed(1)}</span>
          </span>
        </div>
        
        <div className="description-section">
          <h3>{t('common.description')}</h3>
          <p>{selectedHotel.description}</p>
        </div>
        
        <div className="hotel-amenities-large">
          <h3>{t('common.amenitiesServices', t('booking.amenities', 'Amenities'))}</h3>
          <div className="amenities-grid">
            {selectedHotel?.amenities?.map((amenity, index) => (
              <span key={index} className="amenity-tag-large">
                <span className="amenity-ico">{getAmenityIcon(amenity)}</span> {amenityLabel(amenity, t)}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="booking-form-container">
        <h2>{t('bookNow')}</h2>
        <div className="price-box">
          <span className="price">{(selectedHotel.price_per_night || selectedHotel.price)} {t('common.perNight')}</span>
        </div>
        
        <form onSubmit={handleBookingSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>{t('booking.fullName')} *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder={t('booking.enterYourName')}
              />
            </div>
            
            <div className="form-group">
              <label>{t('booking.email')} *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={t('booking.enterYourEmail')}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t('booking.phone')} *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder={t('booking.enterYourPhone')}
              />
            </div>
            
            <div className="form-group">
              <label>{t('booking.rooms')} *</label>
              <input
                type="number"
                min={1}
                max={10}
                value={rooms}
                onChange={e => setRooms(Number(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t('booking.guests')} *</label>
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t('booking.checkIn')} *</label>
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>{t('booking.checkOut')} *</label>
            <input
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              disabled={!checkIn}
              required
            />
          </div>
          
          <div className="booking-summary">
            <h4>{t('bookingSummary')}</h4>
            <div className="summary-item">
              <span>{t('booking.nights')}:</span>
              <span>{calcNights()}</span>
            </div>
            <div className="summary-item">
              <span>{t('booking.totalPrice')}:</span>
              <span>
                {calcNights() > 0
                  ? `${(((selectedHotel.price_per_night || selectedHotel.price) * calcNights()) * rooms).toLocaleString()} ${t('egp')}`
                  : `0 ${t('egp')}`}
              </span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting || calcNights() <= 0}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {t('processing')}...
              </>
            ) : (
              t('confirmBooking')
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelBooking;
