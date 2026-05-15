<template>
  <AppTable 
    :columns="columns" 
    :data="data" 
    :loading="loading" 
    :page="page"
    :limit="limit"
    :total="total"
    selectable
    @update:page="$emit('update:page', $event)"
    @update:limit="$emit('update:limit', $event)"
    @selection-change="$emit('selection-change', $event)"
  >
    <template #product="{ row }">
      <div class="product-cell">
        <div class="product-img-wrapper">
          <img :src="row.imageUrl" v-if="row.imageUrl" />
          <Package class="placeholder-icon" v-else />
        </div>
        <div class="product-info">
          <div class="product-name">
            {{ row.name }}
            <Pin class="pin-icon" v-if="row.isPinned" />
          </div>
          <div class="product-sku">SKU: {{ row.sku }}</div>
        </div>
      </div>
    </template>
    
    <template #shop="{ row }">
      <div class="shop-cell">
        <div class="shop-name">{{ row.shopName }}</div>
        <div class="shop-handle">@{{ row.shopName.toLowerCase().replace(/\\s+/g, '') }}</div>
      </div>
    </template>
    
    <template #category="{ row }">
      <StatusBadge :status="row.category" :showDot="false" />
    </template>
    
    <template #price="{ row }">
      <div class="price-cell">
        <div class="current-price">{{ formatCurrency(row.price) }}</div>
        <div class="mrp-price">MRP {{ formatCurrency(row.mrp) }}</div>
      </div>
    </template>
    
    <template #stockStatus="{ row }">
      <StatusBadge :status="row.stockStatus" />
    </template>
    
    <template #status="{ row }">
      <StatusBadge :status="row.status" />
    </template>
    
    <template #city="{ row }">
      <div class="city-cell">
        {{ row.city }}
      </div>
    </template>
    
    <template #addedAt="{ row }">
      <div class="date-cell">
        <div>{{ formatDateStr(row.addedAt).split(',')[0] }}</div>
        <div class="time-text">{{ formatDateStr(row.addedAt).split(',')[1] }}</div>
      </div>
    </template>
    
    <template #actions="{ row }">
      <ProductActionMenu :product="row" @action="$emit('action', $event)" />
    </template>
  </AppTable>
</template>

<script setup>
import { Package, Pin } from '@lucide/vue';
import AppTable from '../../../components/common/AppTable.vue';
import StatusBadge from '../../../components/common/StatusBadge.vue';
import ProductActionMenu from './ProductActionMenu.vue';
import { formatDate, formatCurrency } from '../../../utils/formatters';

const props = defineProps({
  data: Array,
  loading: Boolean,
  page: Number,
  limit: Number,
  total: Number
});

defineEmits(['update:page', 'update:limit', 'selection-change', 'action']);

const columns = [
  { key: 'product', label: 'Product' },
  { key: 'shop', label: 'Shop' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stockStatus', label: 'Stock' },
  { key: 'status', label: 'Status' },
  { key: 'city', label: 'City' },
  { key: 'addedAt', label: 'Added On' },
  { key: 'actions', label: 'Actions' }
];

const formatDateStr = (date) => formatDate(date);
</script>

<style scoped>
.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-img-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: var(--bg-surface-sunken);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.product-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.pin-icon {
  width: 14px;
  height: 14px;
  color: var(--primary-color);
}

.product-sku {
  font-size: 12px;
  color: var(--text-muted);
}

.shop-name {
  font-weight: 500;
  color: var(--text-primary);
}

.shop-handle {
  font-size: 12px;
  color: var(--text-muted);
}

.price-cell {
  display: flex;
  flex-direction: column;
}

.current-price {
  font-weight: 500;
  color: var(--text-primary);
}

.mrp-price {
  font-size: 11px;
  color: var(--text-muted);
  text-decoration: line-through;
}

.city-cell {
  color: var(--text-secondary);
}

.date-cell {
  font-size: 13px;
}

.time-text {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
