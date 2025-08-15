export interface Review {
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
  stayDate?: string; // When the user stayed
  roomType?: string; // For hotels
  tripType?: 'business' | 'leisure' | 'family' | 'couple' | 'solo';
}

export interface RatingStats {
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

export interface ReviewFilters {
  sortBy: 'newest' | 'highest' | 'lowest' | 'mostHelpful';
  rating?: number;
  tripType?: string;
  hasImages?: boolean;
  searchTerm?: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  stayDate?: string;
  tripType?: string;
  roomType?: string;
  images: File[];
}
