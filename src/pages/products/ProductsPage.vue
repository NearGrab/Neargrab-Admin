<template>
  <div class="products-page">
    <div class="page-header">
      <div class="page-title">
        <h1>Product Management</h1>
        <div class="page-subtitle">Manage, review and promote products across all cities.</div>
      </div>
      <div class="page-actions">
        <select class="city-picker">
          <option>All Cities</option>
          <option>Surat</option>
          <option>Navsari</option>
        </select>
        <button class="btn btn-outline">
          <Download class="icon" /> Export
        </button>
        <button class="btn btn-primary">
          <Plus class="icon" /> Add Product
        </button>
      </div>
    </div>

    <ProductMetricGrid v-if="metrics" :totals="metrics" />
    
    <div class="two-col-layout">
      <div class="main-column">
        <div class="table-container">
          <div v-if="errorMessage" class="error-banner">
            <span>{{ errorMessage }}</span>
            <button class="btn-close" @click="errorMessage = null">&times;</button>
          </div>
          <ProductFilters @filter="handleFilter" />
          
          <div class="active-filters" v-if="hasActiveFilters">
            <div class="filter-chip" v-if="filters.city !== 'all'">
              City: {{ filters.city }} <X class="chip-close" @click="removeFilter('city')" />
            </div>
            <div class="filter-chip" v-if="filters.category !== 'all'">
              Category: {{ formatLabel(filters.category) }} <X class="chip-close" @click="removeFilter('category')" />
            </div>
            <div class="filter-chip" v-if="filters.status !== 'all'">
              Status: {{ formatLabel(filters.status) }} <X class="chip-close" @click="removeFilter('status')" />
            </div>
            <button class="clear-all-btn" @click="clearAllFilters">Clear All</button>
          </div>
          
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id" 
              class="tab-btn" 
              :class="{ active: activeTab === tab.id }"
              @click="setActiveTab(tab.id)"
            >
              {{ tab.label }}
              <span class="tab-badge" v-if="tab.count !== undefined">{{ tab.count }}</span>
            </button>
          </div>
          
          <ProductTable 
            :data="products" 
            :loading="loading"
            :page="filters.page"
            :limit="filters.limit"
            :total="totalProducts"
            @update:page="filters.page = $event; loadProducts()"
            @update:limit="filters.limit = $event; loadProducts()"
            @selection-change="selectedProducts = $event"
            @action="handleAction"
          />
        </div>
      </div>
      
      <div class="side-column">
        <ProductPinnedPanel 
          :rules="pinRules" 
          :allProducts="allProducts"
          :selectedCount="selectedProducts.length"
          @unpin="handleAction({ action: 'unpin-product', productId: $event })"
          @bulk-action="handleBulkAction"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Download, Plus, X } from '@lucide/vue';
import { productService } from '../../services/productService';
import ProductMetricGrid from './components/ProductMetricGrid.vue';
import ProductFilters from './components/ProductFilters.vue';
import ProductTable from './components/ProductTable.vue';
import ProductPinnedPanel from './components/ProductPinnedPanel.vue';

const metrics = ref(null);
const pinRules = ref([]);
const products = ref([]);
const allProducts = ref([]); // Needed for pinned panel regardless of current page
const loading = ref(false);
const totalProducts = ref(0);
const selectedProducts = ref([]);
const errorMessage = ref(null);

const activeTab = ref('all');

const tabs = computed(() => [
  { id: 'all', label: 'All Products' },
  { id: 'pending', label: 'Pending Approval', count: metrics.value?.pendingApproval || 0 },
  { id: 'flagged', label: 'Flagged', count: metrics.value?.flagged || 0 },
  { id: 'out_of_stock', label: 'Out of Stock', count: metrics.value?.outOfStock || 0 },
  { id: 'pinned', label: 'Pinned Products', count: metrics.value?.pinned || 0 }
]);

const filters = reactive({
  search: '',
  category: 'all',
  city: 'all',
  status: 'all',
  stockStatus: 'all',
  isPinned: undefined,
  page: 1,
  limit: 10
});

const hasActiveFilters = computed(() => {
  return filters.city !== 'all' || filters.category !== 'all' || filters.status !== 'all' || filters.stockStatus !== 'all';
});

const formatLabel = (val) => {
  if (!val) return '';
  return val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const loadMetrics = async () => {
  try {
    metrics.value = await productService.getMetrics();
    pinRules.value = await productService.getPinnedByCity();
    
    // Load all products for the pinned panel side view
    const res = await productService.listProducts({ limit: 1000 });
    allProducts.value = res.data;
  } catch (err) {
    console.error('Failed to load product metrics', err);
  }
};

const loadProducts = async () => {
  loading.value = true;
  try {
    const { data, total } = await productService.listProducts(filters);
    products.value = data;
    totalProducts.value = total;
  } catch (err) {
    console.error('Failed to load products', err);
  } finally {
    loading.value = false;
  }
};

const handleFilter = (newFilters) => {
  Object.assign(filters, newFilters);
  filters.page = 1;
  loadProducts();
};

const removeFilter = (key) => {
  filters[key] = 'all';
  loadProducts();
};

const clearAllFilters = () => {
  filters.category = 'all';
  filters.city = 'all';
  filters.status = 'all';
  filters.stockStatus = 'all';
  loadProducts();
};

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  filters.page = 1;
  
  if (tabId === 'all') {
    filters.status = 'all';
    filters.stockStatus = 'all';
    filters.isPinned = undefined;
  } else if (tabId === 'pending') {
    filters.status = 'pending_approval';
    filters.stockStatus = 'all';
    filters.isPinned = undefined;
  } else if (tabId === 'flagged') {
    filters.status = 'flagged';
    filters.stockStatus = 'all';
    filters.isPinned = undefined;
  } else if (tabId === 'out_of_stock') {
    filters.stockStatus = 'out_of_stock';
    filters.status = 'all';
    filters.isPinned = undefined;
  } else if (tabId === 'pinned') {
    filters.isPinned = true;
    filters.status = 'all';
    filters.stockStatus = 'all';
  }
  
  loadProducts();
};

const handleAction = async ({ action, productId }) => {
  errorMessage.value = null;
  loading.value = true;
  try {
    if (action === 'approve-product') {
      await productService.updateProduct(productId, { status: 'active' });
    } else if (action === 'flag-product') {
      if (!confirm('Are you sure you want to flag this product? It will be hidden from the explore feed and public listings.')) {
        loading.value = false;
        return;
      }
      await productService.updateProduct(productId, { status: 'flagged' });
    } else if (action === 'pin-product') {
      await productService.pinProduct(productId);
    } else if (action === 'unpin-product') {
      await productService.unpinProduct(productId);
    } else if (action === 'mark-out-of-stock') {
      await productService.updateProduct(productId, { stockStatus: 'out_of_stock' });
    } else if (action === 'mark-in-stock') {
      await productService.updateProduct(productId, { stockStatus: 'in_stock' });
    }
    
    await loadProducts();
    await loadMetrics();
  } catch (err) {
    console.error(`Failed action ${action}`, err);
    errorMessage.value = err.message || `Failed to perform ${action.replace('-', ' ')}.`;
  } finally {
    loading.value = false;
  }
};

const handleBulkAction = async (action) => {
  if (selectedProducts.value.length === 0) return;
  errorMessage.value = null;
  loading.value = true;
  
  try {
    if (action === 'approve') {
      await productService.bulkUpdateProducts(selectedProducts.value, { status: 'active' });
    } else if (action === 'mark_out_of_stock') {
      await productService.bulkUpdateProducts(selectedProducts.value, { stockStatus: 'out_of_stock' });
    }
    
    // Clear selection
    selectedProducts.value = [];
    await loadProducts();
    await loadMetrics();
  } catch (err) {
    console.error(`Failed bulk action ${action}`, err);
    errorMessage.value = err.message || `Failed bulk action ${action}.`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMetrics();
  loadProducts();
});
</script>

<style scoped>
.city-picker {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: white;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #e6f4ea;
  color: var(--primary-color);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #bbf7d0;
}

.chip-close {
  width: 14px;
  height: 14px;
  cursor: pointer;
  opacity: 0.7;
}

.chip-close:hover {
  opacity: 1;
}

.clear-all-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  padding: 4px 8px;
}

.clear-all-btn:hover {
  color: var(--text-primary);
}

.tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-badge {
  background: var(--bg-surface-sunken);
  color: var(--text-secondary);
  padding: 2px 6px;
  border-radius: 9999px;
  font-size: 11px;
}

.tab-btn.active .tab-badge {
  background: #e6f4ea;
  color: var(--primary-color);
}

@media (max-width: 1024px) {
  .side-column {
    order: -1; /* Move panels to top on mobile */
  }
}

.error-banner {
  background-color: #FEF2F2;
  border: 1px solid var(--danger-color);
  color: #B91C1C;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-close {
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  color: #B91C1C;
  cursor: pointer;
  padding: 0;
}
</style>
