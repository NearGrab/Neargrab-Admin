import apiClient from './apiClient';

function buildQueryString(params) {
  const cleanParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = value;
    }
  }
  return new URLSearchParams(cleanParams).toString();
}

export const userService = {
  async listUsers(filters = {}) {
    const queryParams = {
      search: filters.search,
      role: filters.role,
      status: filters.status,
      city: filters.city,
      page: filters.page,
      limit: filters.limit
    };
    const query = buildQueryString(queryParams);
    const { data } = await apiClient.get(`/api/v1/admin/users?${query}`);
    
    const users = (data.users || []).map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone || '',
      role: u.role ? u.role.toLowerCase() : 'customer',
      status: u.status ? u.status.toLowerCase() : 'active',
      city: u.city || '',
      verified: !!(u.emailVerifiedAt || u.phoneVerifiedAt),
      avatarUrl: u.avatar?.url || '',
      joinedAt: u.createdAt
    }));

    return { data: users, total: data.meta?.total || users.length };
  },

  async updateUser(userId, patch) {
    const backendPatch = {};
    if (patch.role) {
      backendPatch.role = patch.role.toUpperCase();
    }
    if (patch.status) {
      backendPatch.status = patch.status.toUpperCase();
    }
    const { data } = await apiClient.patch(`/api/v1/admin/users/${userId}`, backendPatch);
    return { success: true, user: data };
  },

  async deleteUser(userId) {
    await apiClient.delete(`/api/v1/admin/users/${userId}`);
    return { success: true };
  },

  async getMetrics() {
    try {
      const { data } = await apiClient.get('/api/v1/admin/dashboard');
      return {
        totalUsers: data.systemSummary?.activeUsers || 0,
        totalUsersTrend: data.totals?.newUsersTrend || 0,
        customers: ((data.systemSummary?.activeUsers || 0) - (data.systemSummary?.activeShops || 0)) || 0,
        customersTrend: data.totals?.newUsersTrend || 0,
        shopkeepers: data.systemSummary?.activeShops || 0,
        shopkeepersTrend: data.totals?.newShopsTrend || 0,
        suspended: data.systemSummary?.flaggedContent || 0,
        suspendedTrend: 0,
        newThisWeek: data.totals?.newUsers || 0,
        newThisWeekTrend: data.totals?.newUsersTrend || 0
      };
    } catch (err) {
      console.error('Failed to load user metrics from dashboard:', err);
      return {
        totalUsers: 0,
        totalUsersTrend: 0,
        customers: 0,
        customersTrend: 0,
        shopkeepers: 0,
        shopkeepersTrend: 0,
        suspended: 0,
        suspendedTrend: 0,
        newThisWeek: 0,
        newThisWeekTrend: 0
      };
    }
  },

  // Shop verification services
  async listShops(filters = {}) {
    const query = buildQueryString(filters);
    const { data } = await apiClient.get(`/api/v1/admin/shops?${query}`);
    return data;
  },

  async getShopDetail(shopId) {
    const { data } = await apiClient.get(`/api/v1/admin/shops/${shopId}`);
    return data;
  },

  async verifyShop(shopId, verificationData) {
    const { data } = await apiClient.patch(`/api/v1/admin/shops/${shopId}/verify`, verificationData);
    return data;
  }
};
