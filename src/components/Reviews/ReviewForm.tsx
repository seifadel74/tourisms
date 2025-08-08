import React, { useState, useRef, ChangeEvent } from 'react';
import { ReviewFormData } from '../../types/reviews';
import { Star, Image as ImageIcon, X, Loader2, Calendar, User, Home } from 'lucide-react';
// Function to format date as YYYY-MM-DD (local date string)
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface ReviewFormProps {
  entityType: 'hotel' | 'yacht';
  entityName: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  entityType,
  entityName,
  onSubmit,
  onCancel,
  loading = false,
  className = '',
}) => {
  const [formData, setFormData] = useState<Omit<ReviewFormData, 'images'>>({
    rating: 0,
    title: '',
    comment: '',
    stayDate: formatDate(new Date()),
    tripType: 'leisure',
    roomType: '',
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and size
      const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!validTypes.includes(file.type)) {
          setErrors(prev => ({
            ...prev,
            images: 'Only JPG, PNG, and WebP images are allowed.'
          }));
          return false;
        }
        
        if (file.size > maxSize) {
          setErrors(prev => ({
            ...prev,
            images: 'Image size should be less than 5MB.'
          }));
          return false;
        }
        
        return true;
      });
      
      // Limit to 5 images
      const remainingSlots = 5 - images.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      
      if (filesToAdd.length < validFiles.length) {
        setErrors(prev => ({
          ...prev,
          images: 'You can upload up to 5 images.'
        }));
      }
      
      // Create previews
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...filesToAdd]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // Clear image error if any
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.rating) {
      newErrors.rating = 'Please provide a rating';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title is too short (min 5 characters)';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please share your experience';
    } else if (formData.comment.trim().length < 20) {
      newErrors.comment = 'Please provide more details (min 20 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit({
        ...formData,
        images,
      });
      
      // Reset form after successful submission
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        stayDate: formatDate(new Date()),
        tripType: 'leisure',
        roomType: '',
      });
      
      // Clean up object URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImages([]);
      setImagePreviews([]);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit review. Please try again.'
      }));
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isFilled = star <= (hoverRating || formData.rating);
      return (
        <button
          key={star}
          type="button"
          className={`p-1 transition-colors ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              rating: star,
            }));
            
            if (errors.rating) {
              setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.rating;
                return newErrors;
              });
            }
          }}
          disabled={loading}
        >
          <Star className={`w-8 h-8 ${isFilled ? 'fill-current' : ''}`} />
        </button>
      );
    });
  };

  const getRatingLabel = () => {
    const rating = hoverRating || formData.rating;
    const labels = [
      '',
      'Poor',
      'Fair',
      'Good',
      'Very Good',
      'Excellent',
    ];
    return rating > 0 ? labels[rating] : '';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Write a review for {entityType === 'hotel' ? 'this hotel' : 'this yacht'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your overall rating
            </label>
            <div className="flex items-center">
              <div className="flex">
                {renderStars()}
              </div>
              <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                {getRatingLabel()}
              </span>
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rating}</p>
            )}
          </div>
          
          {/* Review Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Review title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Summarize your experience"
              disabled={loading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>
          
          {/* Review Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your review
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={5}
              value={formData.comment}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.comment ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Share details about your experience..."
              disabled={loading}
            />
            {errors.comment ? (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.comment}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Min. 20 characters
              </p>
            )}
          </div>
          
          {/* Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stay Date */}
            <div>
              <label htmlFor="stayDate" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="w-4 h-4 mr-1.5" />
                When did you stay?
              </label>
              <input
                type="date"
                id="stayDate"
                name="stayDate"
                value={formData.stayDate}
                onChange={handleInputChange}
                max={formatDate(new Date())}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              />
            </div>
            
            {/* Trip Type */}
            <div>
              <label htmlFor="tripType" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User className="w-4 h-4 mr-1.5" />
                Trip type
              </label>
              <select
                id="tripType"
                name="tripType"
                value={formData.tripType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              >
                <option value="leisure">Leisure</option>
                <option value="business">Business</option>
                <option value="family">Family</option>
                <option value="couple">Couple</option>
                <option value="solo">Solo</option>
              </select>
            </div>
            
            {/* Room Type (only for hotels) */}
            {entityType === 'hotel' && (
              <div className="md:col-span-2">
                <label htmlFor="roomType" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Home className="w-4 h-4 mr-1.5" />
                  Room type (optional)
                </label>
                <input
                  type="text"
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="E.g., Deluxe Room, Suite, etc."
                  disabled={loading}
                />
              </div>
            )}
          </div>
          
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add photos (optional)
            </label>
            
            <div className="mt-1 flex items-center">
              <div className="flex-1">
                <div className="flex flex-wrap gap-3">
                  {/* Image Previews */}
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Button */}
                  {imagePreviews.length < 5 && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        disabled={loading || imagePreviews.length >= 5}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-400 hover:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading || imagePreviews.length >= 5}
                      >
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{5 - imagePreviews.length} left</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {errors.images && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.images}</p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Upload up to 5 photos (JPG, PNG, WebP, max 5MB each)
                </p>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row-reverse justify-end gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
          
          {errors.submit && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.submit}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
