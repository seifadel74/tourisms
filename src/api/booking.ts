import api from '../api';

interface Booking {
  id: number;
  customer: string;
  hotel?: string;
  yacht?: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  hours?: number;
  status: 'مؤكد' | 'معلق' | 'ملغي';
}

export async function createBooking(data: any) {
  const res = await api.post('/bookings', data);
  return res.data.data;
}

export async function fetchBookings(params = {}) {
  try {
    const res = await api.get('/bookings', { params });
    const bookings = res.data?.data ?? res.data?.bookings ?? res.data;
    return Array.isArray(bookings) ? bookings : [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// Fetch user's own bookings
export async function fetchUserBookings() {
  try {
    const res = await api.get('/auth/bookings');
    
    // Handle different response structures
    if (res.data?.success && res.data?.data) {
      const bookings = res.data.data.bookings || res.data.data;
      return Array.isArray(bookings) ? bookings : [];
    }
    
    // Fallback for direct array response
    const bookings = res.data?.data ?? res.data?.bookings ?? res.data;
    return Array.isArray(bookings) ? bookings : [];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
}

// Cancel a booking
export async function cancelBooking(id: number) {
  try {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}

export async function updateBooking(id: number, data: Partial<Booking>) {
    const res = await api.put(`/bookings/${id}`, data);
    return res.data.data;
}

export async function deleteBooking(id: number) {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
}
