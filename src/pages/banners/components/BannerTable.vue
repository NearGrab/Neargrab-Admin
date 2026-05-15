<template>
  <AppTable 
    :columns="columns" 
    :data="data" 
    :loading="loading" 
    :page="page"
    :limit="limit"
    :total="total"
    @update:page="$emit('update:page', $event)"
    @update:limit="$emit('update:limit', $event)"
  >
    <template #drag>
      <div class="drag-handle" style="cursor: grab; color: #9ca3af;">
        <GripVertical class="icon" />
      </div>
    </template>

    <template #banner="{ row }">
      <div class="banner-img-wrapper" :class="{ 'placeholder': !row.imageUrl }">
        <img :src="row.imageUrl" v-if="row.imageUrl" />
        <Image class="placeholder-icon" v-else />
        <div class="banner-overlay">{{ formatSection(row.section) }}</div>
      </div>
    </template>
    
    <template #titleShop="{ row }">
      <div class="title-cell">
        <div class="banner-title">{{ row.title }}</div>
        <div class="shop-name">{{ row.shopName }}</div>
      </div>
    </template>
    
    <template #city="{ row }">
      <div class="city-cell">{{ row.city }}</div>
    </template>
    
    <template #section="{ row }">
      <div class="section-cell">{{ formatSection(row.section) }}</div>
    </template>
    
    <template #devices="{ row }">
      <div class="devices-cell">
        <Smartphone class="device-icon" :class="{ active: row.devices.includes('mobile') }" />
        <Monitor class="device-icon" :class="{ active: row.devices.includes('desktop') }" />
      </div>
    </template>
    
    <template #status="{ row }">
      <StatusBadge :status="row.status" />
    </template>
    
    <template #schedule="{ row }">
      <div class="schedule-cell" v-if="row.startAt && row.endAt">
        {{ formatDateShort(row.startAt) }} - {{ formatDateShort(row.endAt) }}
      </div>
      <div class="schedule-cell empty" v-else>-</div>
    </template>

    <template #views="{ row }">
      <div class="metrics-cell">{{ row.views ? formatNumber(row.views) : '-' }}</div>
    </template>

    <template #clicks="{ row }">
      <div class="metrics-cell">{{ row.clicks ? formatNumber(row.clicks) : '-' }}</div>
    </template>

    <template #revenue="{ row }">
      <div class="metrics-cell fw-500">{{ row.revenue ? formatCurrency(row.revenue) : '-' }}</div>
    </template>
    
    <template #actions="{ row }">
      <BannerActionMenu :banner="row" @action="$emit('action', $event)" />
    </template>
  </AppTable>
</template>

<script setup>
import { GripVertical, Image, Smartphone, Monitor } from '@lucide/vue';
import AppTable from '../../../components/common/AppTable.vue';
import StatusBadge from '../../../components/common/StatusBadge.vue';
import BannerActionMenu from './BannerActionMenu.vue';
import { formatNumber, formatCurrency } from '../../../utils/formatters';

const props = defineProps({
  data: Array,
  loading: Boolean,
  page: Number,
  limit: Number,
  total: Number
});

defineEmits(['update:page', 'update:limit', 'action']);

const columns = [
  { key: 'drag', label: '' },
  { key: 'banner', label: 'Banner' },
  { key: 'titleShop', label: 'Title & Shop' },
  { key: 'city', label: 'City' },
  { key: 'section', label: 'Section' },
  { key: 'devices', label: 'Devices' },
  { key: 'status', label: 'Status' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'views', label: 'Views' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'actions', label: 'Actions' }
];

const formatSection = (val) => {
  if (!val) return '';
  return val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const formatDateShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>

<style scoped>
.icon {
  width: 18px;
  height: 18px;
}

.banner-img-wrapper {
  width: 100px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  background-color: var(--primary-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-img-wrapper.placeholder {
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
}

.banner-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 9px;
  padding: 2px 4px;
  text-align: center;
  white-space: nowrap;
}

.title-cell {
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 13px;
  white-space: nowrap;
}

.shop-name {
  font-size: 11px;
  color: var(--text-secondary);
}

.city-cell, .section-cell, .schedule-cell, .metrics-cell {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.section-cell {
  color: var(--primary-color);
  font-weight: 500;
}

.schedule-cell.empty {
  text-align: center;
}

.devices-cell {
  display: flex;
  gap: 8px;
}

.device-icon {
  width: 16px;
  height: 16px;
  color: #d1d5db;
}

.device-icon.active {
  color: var(--text-secondary);
}

.fw-500 {
  font-weight: 500;
  color: var(--text-primary);
}
</style>
