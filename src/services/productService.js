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

export const productService = {
  async listProducts(filters = {}) {
    const queryParams = {
      search: filters.search,
      category: filters.category,
      status: filters.status,
      stockStatus: filters.stockStatus,
      city: filters.city,
      isPinned: filters.isPinned,
      page: filters.page,
      limit: filters.limit
    };
    const query = buildQueryString(queryParams);
    const { data } = await apiClient.get(`/api/v1/admin/products?${query}`);

    const products = (data.products || []).map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku || '',
      shopId: p.shopId,
      shopName: p.shop?.name || '',
      category: p.category?.name || '',
      brand: p.brand?.name || '',
      city: p.shop?.address?.city || '',
      price: p.pricePaise ? p.pricePaise / 100 : 0,
      mrp: p.mrpPaise ? p.mrpPaise / 100 : 0,
      currency: 'INR',
      stockStatus: p.stockStatus ? p.stockStatus.toLowerCase() : 'in_stock',
      status: p.status ? p.status.toLowerCase() : 'active',
      isPinned: !!p.isPinned,
      isFlagged: !!p.isFlagged,
      imageUrl: p.images?.[0]?.media?.url || '',
      addedAt: p.createdAt
    }));

    return { data: products, total: data.meta?.total || products.length };
  },

  async updateProduct(productId, patch) {
    const backendPatch = {};
    if (patch.status) {
      backendPatch.status = patch.status.toUpperCase();
    }
    if (patch.isFlagged !== undefined) {
      backendPatch.isFlagged = patch.isFlagged;
    }
    const { data } = await apiClient.patch(`/api/v1/admin/products/${productId}`, backendPatch);
    return { success: true, product: data };
  },

  async bulkUpdateProducts(productIds, patch) {
    const backendPatch = { productIds };
    if (patch.status) {
      backendPatch.status = patch.status.toUpperCase();
    }
    if (patch.isFlagged !== undefined) {
      backendPatch.isFlagged = patch.isFlagged;
    }
    const { data } = await apiClient.patch(`/api/v1/admin/products/bulk`, backendPatch);
    return { success: true, ...data };
  },

  async pinProduct(productId) {
    const { data } = await apiClient.post(`/api/v1/admin/products/${productId}/pin`);
    return data;
  },

  async unpinProduct(productId) {
    const { data } = await apiClient.post(`/api/v1/admin/products/${productId}/unpin`);
    return data;
  },

  async getMetrics() {
    try {
      const { data } = await apiClient.get('/api/v1/admin/dashboard');
      const inStock = data.systemSummary?.inStockProducts || 0;
      const outOfStock = data.systemSummary?.outOfStockProducts || 0;
      const total = inStock + outOfStock;
      return {
        totalProducts: total,
        totalProductsTrend: data.totals?.productsAddedTrend || 0,
        inStock: inStock,
        inStockPercent: total > 0 ? parseFloat(((inStock / total) * 100).toFixed(1)) : 0.0,
        outOfStock: outOfStock,
        outOfStockPercent: total > 0 ? parseFloat(((outOfStock / total) * 100).toFixed(1)) : 0.0,
        pinned: 0,
        shopsWithProducts: data.systemSummary?.activeShops || 0,
        shopsWithProductsTrend: data.totals?.newShopsTrend || 0,
        pendingApproval: 0,
        flagged: data.systemSummary?.flaggedContent || 0
      };
    } catch (err) {
      console.error('Failed to load product metrics:', err);
      return {
        totalProducts: 0,
        totalProductsTrend: 0,
        inStock: 0,
        inStockPercent: 0,
        outOfStock: 0,
        outOfStockPercent: 0,
        pinned: 0,
        shopsWithProducts: 0,
        shopsWithProductsTrend: 0,
        pendingApproval: 0,
        flagged: 0
      };
    }
  },

  async getPinnedByCity() {
    const { data } = await apiClient.get('/api/v1/admin/pin-rules');
    // Map pin-rules into expected rules format if they are for both product and banner
    // Backend returns rule list. Let's filter targetType === 'PRODUCT' if present, or return all
    const productRules = (data || []).filter(r => r.targetType === 'PRODUCT' || !r.targetType);
    return productRules;
  }
};
