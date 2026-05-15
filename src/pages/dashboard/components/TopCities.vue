<template>
  <AppCard class="top-cities">
    <div class="card-header">
      <h3>Top Performing Cities</h3>
      <select class="chart-select">
        <option>By Leads</option>
        <option>By Shops</option>
      </select>
    </div>
    
    <div class="cities-list">
      <div class="city-item" v-for="city in data" :key="city.city">
        <div class="city-info">
          <div class="city-name">
            <MapPin class="icon" />
            {{ city.city }}
          </div>
          <div class="city-value">{{ formatValue(city.leads) }}</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${city.percent}%` }"></div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { MapPin } from '@lucide/vue';
import AppCard from '../../../components/common/AppCard.vue';

defineProps({
  data: Array
});

const formatValue = (val) => new Intl.NumberFormat('en-IN').format(val);
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.chart-select {
  font-size: 13px;
  padding: 4px 8px;
  color: var(--text-secondary);
}

.cities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.city-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.city-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.city-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.icon {
  width: 14px;
  height: 14px;
}

.city-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.progress-bar {
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
}
</style>
