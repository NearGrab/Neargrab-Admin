<template>
  <AppCard class="donut-chart">
    <h3>Leads by Source</h3>
    <div class="donut-body">
      <!-- Simulated Donut Chart using CSS conic-gradient -->
      <div class="donut-visual" :style="donutStyle">
        <div class="donut-hole"></div>
      </div>
      
      <div class="donut-legend">
        <div class="legend-item" v-for="item in data" :key="item.source">
          <div class="legend-label">
            <span class="dot" :style="{ backgroundColor: item.color }"></span>
            {{ item.source }}
          </div>
          <div class="legend-value">{{ item.percent }}%</div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue';
import AppCard from '../../../components/common/AppCard.vue';

const props = defineProps({
  data: Array
});

const donutStyle = computed(() => {
  if (!props.data || props.data.length === 0) return '';
  
  let stops = [];
  let currentPercent = 0;
  
  for (const item of props.data) {
    stops.push(`${item.color} ${currentPercent}% ${currentPercent + item.percent}%`);
    currentPercent += item.percent;
  }
  
  return {
    background: `conic-gradient(${stops.join(', ')})`
  };
});
</script>

<style scoped>
.donut-chart h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
}

.donut-body {
  display: flex;
  align-items: center;
  gap: 32px;
}

.donut-visual {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.donut-hole {
  width: 100px;
  height: 100px;
  background-color: var(--bg-surface);
  border-radius: 50%;
}

.donut-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.legend-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-value {
  font-weight: 500;
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .donut-body {
    flex-direction: column;
  }
}
</style>
