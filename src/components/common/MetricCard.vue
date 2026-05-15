<template>
  <div class="metric-card card">
    <div class="metric-header">
      <span class="metric-title">{{ title }}</span>
      <div class="metric-icon" :class="iconVariant">
        <slot name="icon"></slot>
      </div>
    </div>
    <div class="metric-value">{{ formatValue(value) }}</div>
    <div class="metric-trend" :class="trend > 0 ? 'positive' : 'negative'" v-if="trend !== undefined">
      <TrendingUp class="trend-icon" v-if="trend > 0" />
      <TrendingDown class="trend-icon" v-else />
      <span>{{ Math.abs(trend) }}% vs last month</span>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown } from '@lucide/vue';

const props = defineProps({
  title: String,
  value: [Number, String],
  trend: Number,
  iconVariant: {
    type: String,
    default: 'default' // 'success', 'warning', 'danger', etc.
  }
});

const formatValue = (val) => {
  if (typeof val === 'number') {
    return new Intl.NumberFormat('en-IN').format(val);
  }
  return val;
};
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.metric-title {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon.default { background-color: #f3f4f6; color: #4b5563; }
.metric-icon.success { background-color: #d1fae5; color: #059669; }
.metric-icon.warning { background-color: #fef3c7; color: #d97706; }
.metric-icon.danger { background-color: #fee2e2; color: #dc2626; }
.metric-icon.primary { background-color: #e6f4ea; color: var(--primary-color); }

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.metric-trend.positive { color: #059669; }
.metric-trend.negative { color: #dc2626; }

.trend-icon {
  width: 14px;
  height: 14px;
}
</style>
