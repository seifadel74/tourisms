import React, { useState, useEffect } from 'react';
import { Review, RatingStats, ReviewFilters, ReviewFormData } from '../../types/reviews';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { PencilLine } from 'lucide-react';

interface ReviewsProps {
  entityType: 'hotel' | 'yacht';
  entityId: string;
  entityName: string;
  initialReviews?: Review[];
  initialRatingStats?: RatingStats;
  onReviewSubmit?: (review: Review) => void;
  onReviewHelpfulClick?: (reviewId: string) => void;
  className?: string;
}

// Mock data for demonstration
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Ahmed Mohamed',
    entityType: 'hotel',
    entityId: 'hotel-1',
    rating: 5,
    title: 'Amazing stay with beautiful views!',
    comment: 'We had a wonderful time at this hotel. The staff was incredibly friendly and the room was clean and comfortable. The view from our balcony was breathtaking. We will definitely be coming back!',
    date: '2025-07-15T10:30:00Z',
    verified: true,
    helpfulCount: 12,
    wasHelpful: false,
    stayDate: '2025-07-10',
    tripType: 'family',
    roomType: 'Deluxe Sea View',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    ],
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sara Ali',
    entityType: 'hotel',
    entityId: 'hotel-1',
    rating: 4,
    title: 'Great location and service',
    comment: 'The hotel is perfectly located near the beach and main attractions. The staff was very helpful and the breakfast was delicious. The only downside was that our room was a bit noisy at night.',
    date: '2025-06-28T14:45:00Z',
    verified: true,
    helpfulCount: 5,
    wasHelpful: true,
    stayDate: '2025-06-20',
    tripType: 'couple',
    roomType: 'Standard Room',
  },
];

const MOCK_RATING_STATS: RatingStats = {
  average: 4.5,
  total: 128,
  distribution: {
    5: 80,
    4: 32,
    3: 10,
    2: 4,
    1: 2,
  },
};

const Reviews: React.FC<ReviewsProps> = ({
  entityType,
  entityId,
  entityName,
  initialReviews = [],
  initialRatingStats = MOCK_RATING_STATS,
  onReviewSubmit,
  onReviewHelpfulClick,
  className = '',
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews.length ? initialReviews : MOCK_REVIEWS);
  const [ratingStats, setRatingStats] = useState<RatingStats>(initialRatingStats);
  const [filters, setFilters] = useState<ReviewFilters>({ sortBy: 'newest' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  // In a real app, this would be an API call
  const fetchReviews = async (filters: ReviewFilters) => {
    // Simulate API call
    return new Promise<{ reviews: Review[]; stats: RatingStats }>((resolve) => {
      setTimeout(() => {
        // Filter and sort reviews based on filters
        let filteredReviews = [...MOCK_REVIEWS];
        
        // Filter by rating
        if (filters.rating) {
          filteredReviews = filteredReviews.filter(r => r.rating === filters.rating);
        }
        
        // Filter by trip type
        if (filters.tripType) {
          filteredReviews = filteredReviews.filter(r => r.tripType === filters.tripType);
        }
        
        // Filter by search term
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredReviews = filteredReviews.filter(
            r => r.title.toLowerCase().includes(searchLower) || 
                 r.comment.toLowerCase().includes(searchLower)
          );
        }
        
        // Filter by has images
        if (filters.hasImages) {
          filteredReviews = filteredReviews.filter(r => r.images && r.images.length > 0);
        }
        
        // Sort reviews
        filteredReviews = [...filteredReviews].sort((a, b) => {
          switch (filters.sortBy) {
            case 'newest':
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'highest':
              return b.rating - a.rating;
            case 'lowest':
              return a.rating - b.rating;
            case 'mostHelpful':
              return b.helpfulCount - a.helpfulCount;
            default:
              return 0;
          }
        });
        
        // In a real app, the server would return updated stats
        resolve({
          reviews: filteredReviews,
          stats: MOCK_RATING_STATS, // Simplified for demo
        });
      }, 500);
    });
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { reviews, stats } = await fetchReviews(filters);
        setReviews(reviews);
        setRatingStats(stats);
      } catch (error) {
        console.error('Error loading reviews:', error);
        showToast('Failed to load reviews. Please try again later.', 'error');
      }
    };

    loadReviews();
  }, [filters]);

  const handleReviewSubmit = async (formData: ReviewFormData) => {
    if (!user) {
      showToast('Please sign in to submit a review.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to submit the review
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview: Review = {
        id: `review-${Date.now()}`,
        userId: user.id,
        userName: user.name || 'Anonymous',
        userAvatar: user.avatar,
        entityType,
        entityId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        date: new Date().toISOString(),
        verified: true,
        helpfulCount: 0,
        wasHelpful: false,
        stayDate: formData.stayDate,
        tripType: formData.tripType as any,
        roomType: formData.roomType,
        images: formData.images ? formData.images.map((_, i) => `https://picsum.photos/seed/${Date.now()}-${i}/800/600`) : [],
      };
      
      // Update local state
      setReviews(prev => [newReview, ...prev]);
      
      // Update rating stats (simplified for demo)
      setRatingStats(prev => ({
        ...prev,
        average: ((prev.average * prev.total) + newReview.rating) / (prev.total + 1),
        total: prev.total + 1,
        distribution: {
          ...prev.distribution,
          [newReview.rating]: (prev.distribution[newReview.rating as keyof typeof prev.distribution] || 0) + 1,
        },
      }));
      
      // Call the callback if provided
      onReviewSubmit?.(newReview);
      
      // Show success message
      showToast('Thank you for your feedback!', 'success');
      
      // Close the form
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulClick = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? {
              ...review,
              wasHelpful: !review.wasHelpful,
              helpfulCount: review.wasHelpful 
                ? Math.max(0, review.helpfulCount - 1) 
                : review.helpfulCount + 1,
            }
          : review
      )
    );
    
    // Call the callback if provided
    onReviewHelpfulClick?.(reviewId);
  };

  const handleFilterChange = (newFilters: ReviewFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews
            {ratingStats.total > 0 && (
              <span className="ml-2 text-lg font-normal text-gray-500">
                ({ratingStats.total} {ratingStats.total === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </h2>
          {ratingStats.total > 0 && (
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(ratingStats.average)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                {ratingStats.average.toFixed(1)} out of 5
              </span>
            </div>
          )}
        </div>
        
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogTrigger>
            <div 
              className="w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault();
                if (!user) {
                  showToast('Please sign in to write a review.', 'error');
                  return;
                }
              }}
            >
              <Button 
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
              >
                <PencilLine className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          </DialogTrigger>
        
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Write a Review</DialogTitle>
            </DialogHeader>
            <ReviewForm
              entityType={entityType}
              entityName={entityName}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
              loading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <ReviewList
        reviews={reviews}
        ratingStats={ratingStats}
        loading={false}
        onFilterChange={handleFilterChange}
        onHelpfulClick={handleHelpfulClick}
      />
    </div>
  );
};

export default Reviews;
