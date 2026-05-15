import bannerData from '../data/banner.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let localBanners = [...bannerData.banners];
let localMetrics = { ...bannerData.metrics };

export const bannerService = {
  async listBanners(filters = {}) {
    await delay(500);
    let filtered = [...localBanners];
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.shopName.toLowerCase().includes(q)
      );
    }
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(b => b.city === filters.city);
    }
    if (filters.section && filters.section !== 'all') {
      filtered = filtered.filter(b => b.section === filters.section);
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status);
    }
    if (filters.device && filters.device !== 'all') {
      filtered = filtered.filter(b => b.devices.includes(filters.device));
    }

    filtered.sort((a, b) => a.sortOrder - b.sortOrder);

    const total = filtered.length;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { data: paginated, total };
  },

  async updateBanner(bannerId, patch) {
    await delay(400);
    const index = localBanners.findIndex(b => b.id === bannerId);
    if (index === -1) throw new Error('Banner not found');
    
    localBanners[index] = { ...localBanners[index], ...patch };
    return { success: true, banner: localBanners[index] };
  },

  async getMetrics() {
    await delay(300);
    return localMetrics;
  },

  async getPinnedByCity() {
    await delay(300);
    return bannerData.pinRules;
  },

  async getPerformance() {
    await delay(300);
    return bannerData.performance;
  }
};
