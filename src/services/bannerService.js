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

function normalizeBanner(b) {
  return {
    id: b.id,
    title: b.title,
    shopId: b.shopId,
    shopName: b.shop?.name || '',
    city: b.city,
    section: b.section ? b.section.toLowerCase() : 'top_hero',
    status: b.status ? b.status.toLowerCase() : 'draft',
    devices: b.devices ? b.devices.map(d => d.toLowerCase()) : ['mobile', 'desktop'],
    plan: b.plan || 'standard',
    imageUrl: b.image?.url || '',
    startAt: b.startAt,
    endAt: b.endAt,
    views: b.views || 0,
    clicks: b.clicks || 0,
    revenue: b.revenuePaise ? b.revenuePaise / 100 : 0,
    currency: 'INR',
    sortOrder: b.sortOrder || 0,
    createdAt: b.createdAt
  };
}

export const bannerService = {
  async listBanners(filters = {}) {
    const queryParams = {
      search: filters.search,
      city: filters.city,
      section: filters.section,
      status: filters.status,
      device: filters.device,
      page: filters.page,
      limit: filters.limit
    };
    if (queryParams.section && queryParams.section !== 'all') {
      queryParams.section = queryParams.section.toUpperCase();
    }
    if (queryParams.status && queryParams.status !== 'all') {
      queryParams.status = queryParams.status.toUpperCase();
    }
    if (queryParams.device && queryParams.device !== 'all') {
      queryParams.device = queryParams.device.toUpperCase();
    }

    const query = buildQueryString(queryParams);
    const { data } = await apiClient.get(`/api/v1/admin/banners?${query}`);
    
    const banners = (data.banners || []).map(normalizeBanner);
    return { data: banners, total: data.meta?.total || banners.length };
  },

  async createBanner(bannerData) {
    const backendData = { ...bannerData };
    if (bannerData.section) {
      backendData.section = bannerData.section.toUpperCase();
    }
    if (bannerData.devices) {
      backendData.devices = bannerData.devices.map(d => d.toUpperCase());
    }
    const { data } = await apiClient.post('/api/v1/admin/banners', backendData);
    return normalizeBanner(data);
  },

  async getBannerDetail(bannerId) {
    const { data } = await apiClient.get(`/api/v1/admin/banners/${bannerId}`);
    return normalizeBanner(data);
  },

  async updateBanner(bannerId, patch) {
    const backendPatch = { ...patch };
    if (patch.section) {
      backendPatch.section = patch.section.toUpperCase();
    }
    if (patch.devices) {
      backendPatch.devices = patch.devices.map(d => d.toUpperCase());
    }
    if (patch.status) {
      backendPatch.status = patch.status.toUpperCase();
    }
    const { data } = await apiClient.patch(`/api/v1/admin/banners/${bannerId}`, backendPatch);
    return { success: true, banner: normalizeBanner(data) };
  },

  async deleteBanner(bannerId) {
    await apiClient.delete(`/api/v1/admin/banners/${bannerId}`);
    return { success: true };
  },

  async pinBanner(bannerId) {
    const { data } = await apiClient.post(`/api/v1/admin/banners/${bannerId}/pin`);
    return normalizeBanner(data);
  },

  async unpinBanner(bannerId) {
    const { data } = await apiClient.post(`/api/v1/admin/banners/${bannerId}/unpin`);
    return normalizeBanner(data);
  },

  async getMetrics() {
    const { data } = await apiClient.get('/api/v1/admin/banners/metrics');
    return {
      ...data,
      totalRevenue: data.totalRevenue ? data.totalRevenue / 100 : 0
    };
  },

  async getPinnedByCity() {
    const { data } = await apiClient.get('/api/v1/admin/pin-rules');
    // Filter out rules for banners specifically
    const bannerRules = (data || []).filter(r => r.targetType === 'BANNER' || !r.targetType);
    return bannerRules;
  },

  async getPerformance() {
    const { data } = await apiClient.get('/api/v1/admin/banners/performance');
    return data;
  }
};
