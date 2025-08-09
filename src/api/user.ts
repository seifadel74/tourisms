import api from '../api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export async function fetchUser() {
  const res = await api.get('/auth/user');
  return res.data.data.user;
}

export async function updateProfile(data: any) {
  const res = await api.put('/auth/profile', data);
  return res.data.data;
}

export async function changePassword(data: any) {
  const res = await api.put('/auth/password', data);
  return res.data.data;
}

export async function fetchUsers(params = {}) {
  try {
    const res = await api.get('/admin/users', { params });
    // Check if we have a valid response structure
    if (res.data?.success === false) {
      throw new Error(res.data?.message || 'Failed to fetch users');
    }
    
    // Handle the response format from backend
    if (res.data?.success && res.data?.data) {
      // If we have pagination data
      if (res.data.data.users && res.data.data.pagination) {
        return {
          users: res.data.data.users,
          pagination: res.data.data.pagination
        };
      }
      // If data is directly users array
      else if (Array.isArray(res.data.data)) {
        return {
          users: res.data.data,
          pagination: { current_page: 1, last_page: 1, total: res.data.data.length }
        };
      }
    }
    
    // Fallback to empty array
    return {
      users: [],
      pagination: { current_page: 1, last_page: 1, total: 0 }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    // Rethrow the error to be handled by the component
    throw error;
  }
}

export const updateUser = async (id: number, userData: any) => {
  try {
    const config: any = {};
    
    // If userData is FormData (contains avatar), set appropriate headers
    if (userData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    
    const response = await api.put(`/users/${id}`, userData, config);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export async function deleteUser(id: number) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}
