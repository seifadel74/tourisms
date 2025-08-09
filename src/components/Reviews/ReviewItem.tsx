import React from 'react';
import { Review } from '../../types/reviews';
import { Star, HelpCircle, ThumbsUp, Image as ImageIcon, Calendar, User, MapPin } from 'lucide-react';
// Function to format date as 'MMM d, yyyy' (e.g., 'Aug 7, 2023')
const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

interface ReviewItemProps {
  review: Review;
  onHelpfulClick?: (reviewId: string) => void;
  className?: string;
}

const tripTypeLabels = {
  business: 'Business',
  leisure: 'Leisure',
  family: 'Family',
  couple: 'Couple',
  solo: 'Solo',
};

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, onHelpfulClick, className = '' }) => {
  const handleHelpfulClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onHelpfulClick?.(review.id);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-lg">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{review.userName}</h4>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>Egypt</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatReviewDate(review.date)}
        </div>
      </div>

      <div className="flex items-center mb-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {review.rating.toFixed(1)}
        </span>
      </div>

      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{review.title}</h3>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {review.images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <img 
                src={image} 
                alt={`Review ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
        {review.stayDate && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Stayed {new Date(review.stayDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        )}
        
        {review.roomType && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{review.roomType}</span>
          </div>
        )}
        
        {review.tripType && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{tripTypeLabels[review.tripType as keyof typeof tripTypeLabels] || review.tripType}</span>
          </div>
        )}
        
        <div className="flex-1"></div>
        
        <button 
          onClick={handleHelpfulClick}
          className={`flex items-center text-sm ${review.wasHelpful ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          <span>Helpful ({review.helpfulCount})</span>
        </button>
      </div>
      
      {review.verified && (
        <div className="mt-3 inline-flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified stay
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
