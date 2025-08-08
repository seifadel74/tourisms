import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, 
  X, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  ChevronDown,
  Wifi,
  Waves,
  Car,
  Utensils,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './SearchFilters.css';

type RatingValue = 1 | 2 | 3 | 4 | 5;

interface FilterState {
  minPrice: string;
  maxPrice: string;
  rating: number;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amenities: string[];
}

interface Amenity {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
  type?: 'hotels' | 'yachts';
  initialFilters?: any;
}

const amenityIcons = {
  wifi: <Wifi size={18} />,
  pool: <Waves size={18} />,
  parking: <Car size={18} />,
  restaurant: <Utensils size={18} />,
  spa: <HeartPulse size={18} />
};

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onFilterChange, 
  type = 'hotels',
  initialFilters
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get all filter translations at once
  const filterLabels = {
    title: t('filters.title', 'Filters'),
    priceRange: t('filters.priceRange', 'Price Range'),
    min: t('filters.min', 'Min'),
    max: t('filters.max', 'Max'),
    rating: t('filters.rating', 'Rating'),
    location: t('filters.location', 'Location'),
    locationPlaceholder: t('filters.locationPlaceholder', 'Enter location...'),
    checkIn: t('filters.checkIn', 'Check-in'),
    checkOut: t('filters.checkOut', 'Check-out'),
    guests: t('filters.guests', 'Guests'),
    amenities: t('filters.amenities', 'Amenities'),
    reset: t('filters.reset', 'Reset'),
    apply: t('filters.apply', 'Apply'),
    // Amenities
    wifi: t('filters.amenities.wifi', 'WiFi'),
    pool: t('filters.amenities.pool', 'Pool'),
    parking: t('filters.amenities.parking', 'Parking'),
    restaurant: t('filters.amenities.restaurant', 'Restaurant'),
    spa: t('filters.amenities.spa', 'Spa')
  };
  const [localFilters, setLocalFilters] = useState<FilterState>(() => ({
    minPrice: '',
    maxPrice: '',
    rating: 0,
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    amenities: [],
    ...(initialFilters || {})
  }));

  // Sync with parent component
  useEffect(() => {
    if (initialFilters) {
      setLocalFilters(prev => ({
        ...prev,
        ...initialFilters
      }));
    }
  }, [initialFilters]);

  const starRatings: RatingValue[] = [5, 4, 3, 2, 1];
  
  // Define amenities with translations from filterLabels
  const amenities = [
    { id: 'wifi', label: filterLabels.wifi, icon: amenityIcons.wifi },
    { id: 'pool', label: filterLabels.pool, icon: amenityIcons.pool },
    { id: 'parking', label: filterLabels.parking, icon: amenityIcons.parking },
    { id: 'restaurant', label: filterLabels.restaurant, icon: amenityIcons.restaurant },
    { id: 'spa', label: filterLabels.spa, icon: amenityIcons.spa },
  ];

  // Handle filter changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setLocalFilters((prev: FilterState) => {
      const updatedValue = type === 'checkbox' ? checked : value;
      const newFilters = {
        ...prev,
        [name]: name === 'guests' 
          ? Math.max(1, parseInt(value) || 1)
          : updatedValue
      };
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters((prev: FilterState) => {
      const newFilters = {
        ...prev,
        rating: prev.rating === rating ? 0 : rating
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const toggleAmenity = (amenityId: string) => {
    setLocalFilters((prev: FilterState) => {
      const newAmenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId];
      
      const newFilters = {
        ...prev,
        amenities: newAmenities
      };
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleRatingClick = (rating: RatingValue) => {
    setLocalFilters((prev: FilterState) => {
      const newRating = prev.rating === rating ? 0 : rating;
      const newFilters = { ...prev, rating: newRating };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleGuestChange = (increment: number) => {
    setLocalFilters((prev: FilterState) => {
      const newGuests = Math.max(1, (prev.guests || 1) + increment);
      const newFilters = { ...prev, guests: newGuests };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  // Handle date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev: FilterState) => {
      const newFilters = { ...prev, [name]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      minPrice: '',
      maxPrice: '',
      rating: 0,
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      amenities: [],
    };
    
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="search-filters-container">
      <button 
        className="filters-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="filters-content"
      >
        <Sliders size={18} />
        {filterLabels.title}
        <ChevronDown size={18} />
      </button>

      <div 
        id="filters-content"
        className="filters-content"
        data-visible={isOpen}
      >
        <div className="filters-grid">
          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">
              <DollarSign size={18} />
              {filterLabels.priceRange}
            </label>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder={filterLabels.min}
                value={localFilters.minPrice}
                onChange={handleInputChange}
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder={filterLabels.max}
                value={localFilters.maxPrice}
                onChange={handleInputChange}
                min={localFilters.minPrice || '0'}
              />
            </div>
          </div>

          {/* Rating */}
          <div className="filter-group">
            <label className="filter-label">
              <Star size={18} />
              {filterLabels.rating}
            </label>
            <div className="rating-stars">
              {starRatings.map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${localFilters.rating >= star ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                >
                  <Star size={20} fill="currentColor" />
                  <span>{star}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="filter-group">
            <label htmlFor="location" className="filter-label">
              <MapPin size={18} />
              {filterLabels.location}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder={filterLabels.locationPlaceholder}
              value={localFilters.location}
              onChange={handleInputChange}
            />
          </div>

          {/* Check-in Date */}
          <div className="filter-group">
            <label htmlFor="checkIn" className="filter-label">
              <Calendar size={18} />
              {filterLabels.checkIn}
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={localFilters.checkIn}
              onChange={handleDateChange}
              min={today}
            />
          </div>

          {/* Check-out Date */}
          <div className="filter-group">
            <label htmlFor="checkOut" className="filter-label">
              <Calendar size={18} />
              {filterLabels.checkOut}
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={localFilters.checkOut}
              onChange={handleDateChange}
              min={localFilters.checkIn || today}
            />
          </div>

          {/* Guests */}
          <div className="filter-group">
            <label className="filter-label">
              <Users size={18} />
              {filterLabels.guests}
            </label>
            <div className="guest-selector">
              <button 
                type="button" 
                className="guest-btn"
                onClick={() => handleGuestChange(-1)}
                disabled={localFilters.guests <= 1}
                aria-label="Decrease guests"
              >
                -
              </button>
              <span className="guest-count">{localFilters.guests}</span>
              <button 
                type="button" 
                className="guest-btn"
                onClick={() => handleGuestChange(1)}
                aria-label="Increase guests"
              >
                +
              </button>
            </div>
          </div>

          {/* Amenities */}
          <div className="filter-group">
            <label className="filter-label">
              <Sliders size={18} />
              {filterLabels.amenities}
            </label>
            <div className="amenities-grid">
              {amenities.map((amenity) => (
                <label 
                  key={amenity.id} 
                  className={`amenity-item ${localFilters.amenities.includes(amenity.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="sr-only"
                  />
                  <span className="amenity-icon">{amenity.icon}</span>
                  <span className="amenity-label">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={resetFilters}
          >
            {filterLabels.reset}
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onFilterChange(localFilters)}
          >
            {filterLabels.apply}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
