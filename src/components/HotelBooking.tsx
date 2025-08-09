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
      price_per_night: 1200,
      rating: 4.5,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      ],
      amenities: ['واي فاي مجاني', 'مسبح', 'مطعم', 'موقف سيارات', 'صالة رياضية'],
      description: 'فندق فاخر يطل على النيل مع إطلالات بانورامية رائعة وخدمة ممتازة.'
    },
    // Add more sample hotels as needed
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
        toast.success(t('bookingConfirmed'));
        
        if (showNotification) {
          showNotification(t('bookingConfirmed'), 'success');
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(t('bookingError'));
      
      if (showNotification) {
        showNotification(t('bookingError'), 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★★★★★'.slice(0, Math.floor(rating)) + '☆☆☆☆☆'.slice(0, 5 - Math.floor(rating));
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}...</p>
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
          <p><strong>{t('bookingId')}:</strong> {bookingId}</p>
          <p><strong>{t('hotelName')}:</strong> {selectedHotel?.name}</p>
          <p><strong>{t('location')}:</strong> {selectedHotel?.location}</p>
          <p><strong>{t('checkIn')}:</strong> {new Date(checkIn).toLocaleDateString()}</p>
          <p><strong>{t('checkOut')}:</strong> {new Date(checkOut).toLocaleDateString()}</p>
          <p><strong>{t('guests')}:</strong> {guests}</p>
          <p><strong>{t('rooms')}:</strong> {rooms}</p>
        </div>
        <button onClick={goHome} className="back-to-home">
          {t('backToHome')}
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
              placeholder={t('searchHotels')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="search-icon">🔍</i>
          </div>
          
          <div className="filter-group">
            <label>{t('filterBy')}:</label>
            <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
              <option value="">{t('allCities')}</option>
              {Array.from(new Set(hotels.map(hotel => hotel.city || hotel.location.split('،')[0].trim())))
                .filter(Boolean)
                .map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
            
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="">{t('allRatings')}</option>
              <option value="4.5">4.5+ ★</option>
              <option value="4">4+ ★</option>
              <option value="3">3+ ★</option>
            </select>
            
            <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
              <option value="">{t('allPrices')}</option>
              <option value="0-500">{t('under')} 500 {t('egp')}</option>
              <option value="500-1000">500 - 1000 {t('egp')}</option>
              <option value="1000-2000">1000 - 2000 {t('egp')}</option>
              <option value="2000-10000">2000+ {t('egp')}</option>
            </select>
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">{t('sortBy')}</option>
              <option value="price_asc">{t('priceLowToHigh')}</option>
              <option value="price_desc">{t('priceHighToLow')}</option>
              <option value="rating">{t('topRated')}</option>
            </select>
          </div>
        </div>
        
        <div className="hotel-grid">
          {sortedHotels.length > 0 ? (
            sortedHotels.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <div 
                  className="hotel-image" 
                  style={{ backgroundImage: `url(${hotel.images[0]})` }}
                  onClick={() => handleHotelSelect(hotel)}
                >
                  <div className="hotel-rating">
                    {renderStars(hotel.rating)}
                    <span>{hotel.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="location">{hotel.location}</p>
                  <p className="description">{hotel.description}</p>
                  <div className="amenities">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="amenity-tag">+{hotel.amenities.length - 3} {t('more')}</span>
                    )}
                  </div>
                  <div className="price-container">
                    <span className="price">{(hotel.price_per_night || hotel.price)} {t('egp')}</span>
                    <span className="per-night">/ {t('perNight')}</span>
                    <button 
                      className="select-button"
                      onClick={() => handleHotelSelect(hotel)}
                    >
                      {t('select')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>{t('noHotelsFound')}</p>
              <button onClick={() => {
                setFilterCity('');
                setFilterRating('');
                setFilterPrice('');
                setSearch('');
              }}>
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Hotel details and booking form
  return (
    <div className="hotel-booking-container">
      <button 
        onClick={() => setSelectedHotel(null)} 
        className="back-button"
      >
        &larr; {t('backToResults')}
      </button>
      
      <div className="hotel-details">
        <div className="hotel-gallery">
          <div 
            className="main-image"
            style={{ backgroundImage: `url(${selectedHotel.images[currentImageIndex]})` }}
          ></div>
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
        
        <div className="hotel-info">
          <h1>{selectedHotel.name}</h1>
          <div className="location-rating">
            <span className="location">{selectedHotel.location}</span>
            <span className="rating">
              {renderStars(selectedHotel.rating)}
              <span className="rating-number">{selectedHotel.rating.toFixed(1)}</span>
            </span>
          </div>
          
          <div className="description-section">
            <h3>{t('description')}</h3>
            <p>{selectedHotel.description}</p>
          </div>
          
          <div className="amenities-section">
            <h3>{t('amenities')}</h3>
            <div className="amenities-grid">
              {selectedHotel.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag-large">
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="booking-form-container">
        <h2>{t('bookNow')}</h2>
        <div className="price-box">
          <span className="price">{(selectedHotel.price_per_night || selectedHotel.price)} {t('egp')}</span>
          <span className="per-night">/ {t('perNight')}</span>
        </div>
        
        <form onSubmit={handleBookingSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>{t('fullName')} *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder={t('enterYourName')}
              />
            </div>
            
            <div className="form-group">
              <label>{t('email')} *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={t('enterYourEmail')}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t('phone')} *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder={t('enterYourPhone')}
              />
            </div>
            
            <div className="form-group">
              <label>{t('rooms')} *</label>
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
              <label>{t('guests')} *</label>
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
              <label>{t('checkIn')} *</label>
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
            <label>{t('checkOut')} *</label>
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
              <span>{t('nights')}:</span>
              <span>
                {checkIn && checkOut 
                  ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
                  : 0}
              </span>
            </div>
            <div className="summary-item">
              <span>{t('totalPrice')}:</span>
              <span>
                {checkIn && checkOut
                  ? `${(
                      (selectedHotel.price_per_night || selectedHotel.price) * 
                      Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) * 
                      rooms
                    ).toLocaleString()} ${t('egp')}`
                  : `0 ${t('egp')}`}
              </span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
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
