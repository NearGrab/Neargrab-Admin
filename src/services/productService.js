import productData from '../data/product.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let localProducts = [...productData.products];
let localMetrics = { ...productData.metrics };

export const productService = {
  async listProducts(filters = {}) {
    await delay(500);
    let filtered = [...localProducts];
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      filtered = filtered.filter(p => p.stockStatus === filters.stockStatus);
    }
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(p => p.city === filters.city);
    }
    if (filters.isPinned !== undefined) {
      filtered = filtered.filter(p => p.isPinned === filters.isPinned);
    }

    const total = filtered.length;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { data: paginated, total };
  },

  async updateProduct(productId, patch) {
    await delay(400);
    const index = localProducts.findIndex(p => p.id === productId);
    if (index === -1) throw new Error('Product not found');
    
    localProducts[index] = { ...localProducts[index], ...patch };
    return { success: true, product: localProducts[index] };
  },

  async bulkUpdateProducts(productIds, patch) {
    await delay(600);
    localProducts = localProducts.map(p => {
      if (productIds.includes(p.id)) {
        return { ...p, ...patch };
      }
      return p;
    });
    return { success: true };
  },

  async getMetrics() {
    await delay(300);
    return localMetrics;
  },

  async getPinnedByCity() {
    await delay(300);
    return productData.pinRules;
  }
};
