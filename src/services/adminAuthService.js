import apiClient from './apiClient';

export const adminAuthService = {
  async login(email, password) {
    const { data } = await apiClient.post('/api/v1/admin/auth/login', { email, password });
    
    // Save tokens and user details
    localStorage.setItem('neargrab_admin_access_token', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('neargrab_admin_refresh_token', data.refreshToken);
    }
    localStorage.setItem('neargrab_admin_user', JSON.stringify(data.user));
    
    return { success: true, admin: data.user };
  },

  async logout() {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (err) {
      console.error('Admin logout endpoint failed:', err);
    } finally {
      localStorage.removeItem('neargrab_admin_access_token');
      localStorage.removeItem('neargrab_admin_refresh_token');
      localStorage.removeItem('neargrab_admin_user');
    }
    return { success: true };
  },

  async getCurrentAdmin() {
    const token = localStorage.getItem('neargrab_admin_access_token');
    if (!token) return null;

    try {
      // Fetch fresh admin profile from GET /api/v1/admin/me
      const { data } = await apiClient.get('/api/v1/admin/me');
      localStorage.setItem('neargrab_admin_user', JSON.stringify(data));
      return data;
    } catch (err) {
      console.error('Failed to get current admin profile:', err);
      // Clear token since it's invalid
      localStorage.removeItem('neargrab_admin_access_token');
      localStorage.removeItem('neargrab_admin_refresh_token');
      localStorage.removeItem('neargrab_admin_user');
      return null;
    }
  }
};
