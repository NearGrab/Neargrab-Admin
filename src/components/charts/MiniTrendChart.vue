<template>
  <AppCard class="mini-trend-chart">
    <div class="chart-header">
      <div class="chart-info">
        <h3>{{ title }}</h3>
        <div class="chart-value">{{ formatValue(value) }}</div>
        <div class="chart-trend" :class="trend > 0 ? 'positive' : 'negative'">
          <TrendingUp class="trend-icon" v-if="trend > 0" />
          <TrendingDown class="trend-icon" v-else />
          <span>{{ Math.abs(trend) }}% vs Apr 18 - May 17</span>
        </div>
      </div>
      <select class="chart-select">
        <option>Daily</option>
      </select>
    </div>
    
    <div class="chart-body">
      <!-- Simple SVG Area chart representation -->
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="chart-svg">
        <defs>
          <linearGradient :id="`grad-${title.replace(/\\s/g,'')}`" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="color" stop-opacity="0.2" />
            <stop offset="100%" :stop-color="color" stop-opacity="0" />
          </linearGradient>
        </defs>
        <!-- Area -->
        <polygon points="0,40 0,30 20,20 40,35 60,15 80,10 100,20 100,40" :fill="`url(#grad-${title.replace(/\\s/g,'')})`" />
        <!-- Line -->
        <polyline points="0,30 20,20 40,35 60,15 80,10 100,20" fill="none" :stroke="color" stroke-width="2" stroke-linejoin="round" />
      </svg>
      <div class="x-axis">
        <span>May 18</span>
        <span>May 25</span>
        <span>Jun 01</span>
        <span>Jun 08</span>
        <span>Jun 16</span>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { TrendingUp, TrendingDown } from '@lucide/vue';
import AppCard from '../common/AppCard.vue';

defineProps({
  title: String,
  value: Number,
  trend: Number,
  color: String
});

const formatValue = (val) => new Intl.NumberFormat('en-IN').format(val);
</script>

<style scoped>
.mini-trend-chart {
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.chart-info h3 {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.chart-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.chart-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.chart-trend.positive { color: #059669; }
.chart-trend.negative { color: #dc2626; }

.trend-icon {
  width: 12px;
  height: 12px;
}

.chart-select {
  padding: 4px 8px;
  font-size: 12px;
}

.chart-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chart-svg {
  width: 100%;
  height: 60px;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 10px;
  color: var(--text-muted);
}
</style>
