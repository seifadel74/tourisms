import React, { useState, useEffect } from 'react';
import { Review, ReviewFilters, RatingStats } from '../../types/reviews';
import ReviewItem from './ReviewItem';
import { Star, Filter, Search, ChevronDown, ChevronUp, X } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  ratingStats?: RatingStats;
  loading?: boolean;
  onFilterChange?: (filters: ReviewFilters) => void;
  onHelpfulClick?: (reviewId: string) => void;
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  ratingStats,
  loading = false,
  onFilterChange,
  onHelpfulClick,
  className = '',
}) => {
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    onFilterChange?.({ ...filters, searchTerm: searchTerm.trim() || undefined });
  }, [filters, searchTerm, onFilterChange]);

  const handleRatingFilter = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? undefined : rating,
    }));
  };

  const handleSortChange = (sortBy: ReviewFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
    }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Boolean(
    filters.rating || 
    filters.tripType || 
    filters.hasImages ||
    searchTerm.trim()
  );

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews
            {reviews.length > 0 && (
              <span className="ml-2 text-gray-500 font-normal">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </h2>
          
          <div className="flex items-center space-x-3
">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {[
                    filters.rating ? 1 : 0,
                    filters.tripType ? 1 : 0,
                    filters.hasImages ? 1 : 0,
                    searchTerm.trim() ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</h3>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as ReviewFilters['sortBy'])}
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                  <option value="mostHelpful">Most helpful</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</h3>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={filters.rating === rating}
                        onChange={() => handleRatingFilter(rating)}
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {rating} {rating === 1 ? 'star' : 'stars'}
                      </span>
                      {ratingStats && (
                        <span className="ml-auto text-xs text-gray-500">
                          {Math.round((ratingStats.distribution[rating as keyof typeof ratingStats.distribution] / ratingStats.total) * 100) || 0}%
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trip type</h3>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.tripType || ''}
                  onChange={(e) => 
                    setFilters(prev => ({
                      ...prev,
                      tripType: e.target.value || undefined,
                    }))
                  }
                >
                  <option value="">All trip types</option>
                  <option value="business">Business</option>
                  <option value="leisure">Leisure</option>
                  <option value="family">Family</option>
                  <option value="couple">Couple</option>
                  <option value="solo">Solo</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={Boolean(filters.hasImages)}
                    onChange={(e) => 
                      setFilters(prev => ({
                        ...prev,
                        hasImages: e.target.checked || undefined,
                      }))
                    }
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">With photos only</span>
                </label>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem 
              key={review.id} 
              review={review} 
              onHelpfulClick={onHelpfulClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reviews found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more results.' 
              : 'Be the first to leave a review!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
