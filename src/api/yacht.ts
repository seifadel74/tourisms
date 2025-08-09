import api from '../api';

interface Yacht {
  id: number;
  name: string;
  location: string;
  price: number;
  price_per_day?: number;
  capacity: number;
  rating?: number;
  images?: string[];
  description?: string;
  amenities?: string[];
}

export async function fetchYachts(params = {}) {
  try {
    const res = await api.get('/yachts', { params });
    
    // Handle different response structures
    if (res.data?.success && res.data?.data) {
      let yachts = res.data.data.yachts || res.data.data;
      
      if (Array.isArray(yachts)) {
        // تطبيع البيانات لضمان توافق أسماء الحقول
        yachts = yachts.map(yacht => ({
          ...yacht,
          price: yacht.price_per_day || yacht.price || 0,
          images: yacht.images || ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
          amenities: yacht.amenities || ['واي فاي', 'مطبخ', 'حمام خاص']
        }));
        
        // Return with pagination if available
        if (res.data.data.pagination) {
          return {
            yachts,
            pagination: res.data.data.pagination
          };
        }
        return yachts;
      }
    }
    
    // Fallback for direct array response
    let yachts = res.data?.data ?? res.data?.yachts ?? res.data;
    if (Array.isArray(yachts)) {
      yachts = yachts.map(yacht => ({
        ...yacht,
        price: yacht.price_per_day || yacht.price || 0,
        images: yacht.images || ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
        amenities: yacht.amenities || ['واي فاي', 'مطبخ', 'حمام خاص']
      }));
      return yachts;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching yachts:', error);
    return [];
  }
}

export async function fetchYacht(id: number) {
  try {
    const res = await api.get(`/yachts/${id}`);
    if (res.data && res.data.data && res.data.data.yacht) {
      return res.data.data.yacht;
    } else if (res.data && res.data.yacht) {
      return res.data.yacht;
    } else if (res.data) {
      return res.data;
    } else {
      console.log('API Response structure:', res.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching yacht:', error);
    throw error;
  }
}

export const addYacht = async (yachtData: any) => {
  const config: any = {};
  
  // If yachtData is FormData (contains images), set appropriate headers
  if (yachtData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
  
  const response = await api.post('/yachts', yachtData, config);
  return response.data;
};

export const updateYacht = async (id: number, yachtData: any) => {
  const config: any = {};
  
  // If yachtData is FormData (contains images), set appropriate headers
  if (yachtData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
  
  const response = await api.put(`/yachts/${id}`, yachtData, config);
  return response.data;
};

export async function deleteYacht(id: number) {
  try {
    const res = await api.delete(`/yachts/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting yacht:', error);
    throw error;
  }
}
