import api from '../api';

interface Hotel {
  id: number;
  name: string;
  city: string;
  price: number;
  price_per_night?: number;
  rating: number;
  images?: string[];
  description?: string;
  location?: string;
  amenities?: string[];
}

export async function fetchHotels(params = {}) {
  try {
    const res = await api.get('/hotels', { params });
    console.log('Raw API response:', res.data);
    
    // Handle different response structures
    if (res.data?.success && res.data?.data) {
      // Check if data has hotels property (paginated response)
      if (res.data.data.hotels && Array.isArray(res.data.data.hotels)) {
        let hotels = res.data.data.hotels;
        
        // Normalize data to ensure field name compatibility
        hotels = hotels.map((hotel: any) => ({
          ...hotel,
          price: hotel.price_per_night || hotel.price || 0,
          images: Array.isArray(hotel.images) ? hotel.images : (hotel.images ? JSON.parse(hotel.images) : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800']),
          location: hotel.city || hotel.location || 'غير محدد',
          amenities: Array.isArray(hotel.amenities) ? hotel.amenities : (hotel.amenities ? JSON.parse(hotel.amenities) : ['واي فاي', 'مطعم', 'خدمة الغرف'])
        }));
        
        console.log('Processed hotels:', hotels);
        return hotels;
      }
      // Direct array in data
      else if (Array.isArray(res.data.data)) {
        let hotels = res.data.data;
        hotels = hotels.map((hotel: any) => ({
          ...hotel,
          price: hotel.price_per_night || hotel.price || 0,
          images: Array.isArray(hotel.images) ? hotel.images : (hotel.images ? JSON.parse(hotel.images) : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800']),
          location: hotel.city || hotel.location || 'غير محدد',
          amenities: Array.isArray(hotel.amenities) ? hotel.amenities : (hotel.amenities ? JSON.parse(hotel.amenities) : ['واي فاي', 'مطعم', 'خدمة الغرف'])
        }));
        
        console.log('Processed hotels (direct array):', hotels);
        return hotels;
      }
    }
    
    // Fallback for other response structures
    let hotels = res.data?.hotels ?? res.data;
    if (Array.isArray(hotels)) {
      hotels = hotels.map(hotel => ({
        ...hotel,
        price: hotel.price_per_night || hotel.price || 0,
        images: hotel.images || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        location: hotel.city || hotel.location || 'غير محدد',
        amenities: hotel.amenities || ['واي فاي', 'مطعم', 'خدمة الغرف']
      }));
      return hotels;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

export async function fetchHotel(id: number) {
  try {
    const res = await api.get(`/hotels/${id}`);
    if (res.data && res.data.data && res.data.data.hotel) {
      return res.data.data.hotel;
    } else if (res.data && res.data.hotel) {
      return res.data.hotel;
    } else if (res.data) {
      return res.data;
    } else {
      console.log('API Response structure:', res.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching hotel:', error);
    throw error;
  }
}

export async function addHotel(hotel: Omit<Hotel, 'id'> | FormData) {
  try {
    const config = hotel instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    const res = await api.post('/hotels', hotel, config);
    return res.data;
  } catch (error) {
    console.error('Error adding hotel:', error);
    throw error;
  }
}

export async function updateHotel(id: number, hotel: Partial<Hotel> | FormData) {
  try {
    const config = hotel instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    const res = await api.put(`/hotels/${id}`, hotel, config);
    return res.data;
  } catch (error) {
    console.error('Error updating hotel:', error);
    throw error;
  }
}

export async function deleteHotel(id: number) {
  try {
    const res = await api.delete(`/hotels/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error;
  }
}
