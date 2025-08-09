# Reviews Component

A comprehensive reviews and ratings system for hotels and yachts in the tourism web application.

## Features

- Display and sort reviews
- Filter reviews by rating, trip type, and more
- Submit new reviews with photos
- Rate and mark reviews as helpful
- Responsive design with dark mode support
- Accessible UI components

## Components

### `ReviewItem`
Displays a single review with all its details.

**Props:**
- `review`: The review object to display
- `onHelpfulClick`: Callback when the "Helpful" button is clicked
- `className`: Additional CSS classes

### `ReviewList`
Displays a list of reviews with filtering and sorting options.

**Props:**
- `reviews`: Array of review objects
- `ratingStats`: Statistics about the ratings
- `loading`: Whether reviews are being loaded
- `onFilterChange`: Callback when filters change
- `onHelpfulClick`: Callback when a review is marked as helpful
- `className`: Additional CSS classes

### `ReviewForm`
A form for submitting new reviews.

**Props:**
- `entityType`: Type of entity being reviewed ('hotel' or 'yacht')
- `entityName`: Name of the entity being reviewed
- `onSubmit`: Callback when the form is submitted
- `onCancel`: Callback when the form is cancelled
- `loading`: Whether the form is being submitted
- `className`: Additional CSS classes

### `Reviews`
Main component that combines all review functionality.

**Props:**
- `entityType`: Type of entity ('hotel' or 'yacht')
- `entityId`: ID of the entity
- `entityName`: Name of the entity
- `initialReviews`: Initial reviews to display (optional)
- `initialRatingStats`: Initial rating statistics (optional)
- `onReviewSubmit`: Callback when a review is submitted
- `onReviewHelpfulClick`: Callback when a review is marked as helpful
- `className`: Additional CSS classes

## Usage

```tsx
import Reviews from './components/Reviews';

// In your component:
const HotelDetails = ({ hotel }) => (
  <div>
    {/* Other hotel details */}
    <Reviews
      entityType="hotel"
      entityId={hotel.id}
      entityName={hotel.name}
      className="mt-8"
    />
  </div>
);
```

## Data Types

### `Review`
```typescript
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  entityType: 'hotel' | 'yacht';
  entityId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string; // ISO date string
  verified: boolean;
  helpfulCount: number;
  wasHelpful?: boolean;
  images?: string[];
  stayDate?: string;
  roomType?: string;
  tripType?: 'business' | 'leisure' | 'family' | 'couple' | 'solo';
}
```

### `RatingStats`
```typescript
interface RatingStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
```

### `ReviewFilters`
```typescript
interface ReviewFilters {
  sortBy: 'newest' | 'highest' | 'lowest' | 'mostHelpful';
  rating?: number;
  tripType?: string;
  hasImages?: boolean;
  searchTerm?: string;
}
```

## Styling

All components use Tailwind CSS for styling. Customize the look by:

1. Overriding Tailwind classes with your own
2. Using the `className` prop to add additional classes
3. Using CSS variables for theming (supports dark mode)

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Proper heading hierarchy
- Focus management
- Screen reader support

## Dependencies

- React
- Tailwind CSS
- Lucide Icons
- date-fns (for date formatting)
- React Hook Form (for form handling)
- React Toast (for notifications)

## Testing

To test the components, you can use the mock data provided in the `Reviews` component.

## Future Improvements

- Add pagination for large numbers of reviews
- Support for replying to reviews
- More advanced filtering options
- Photo gallery for review images
- User profile links
- Social sharing
