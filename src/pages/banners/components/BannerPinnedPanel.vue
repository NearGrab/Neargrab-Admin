<template>
  <div class="right-panels">
    <AppCard class="pinned-panel">
      <div class="panel-header">
        <h3>Pinned Banners by City</h3>
        <p class="panel-desc">Manage which banners are pinned on home page</p>
      </div>
      
      <div class="city-pin-list">
        <div class="city-pin-item" v-for="rule in rules" :key="rule.city">
          <div class="city-name">{{ rule.city }}</div>
          <div class="pin-count">
            <span class="current">{{ rule.currentPins }}</span>
            <span class="separator">/</span>
            <span class="limit">{{ rule.pinLimit }}</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(rule.currentPins / rule.pinLimit) * 100}%` }"
              :class="{ 'full': rule.currentPins >= rule.pinLimit }"
            ></div>
          </div>
        </div>
      </div>
      
      <button class="btn btn-ghost manage-pins-btn mt-3">
        Manage City Pins <ArrowRight class="icon" />
      </button>
    </AppCard>

    <AppCard class="performance-panel">
      <div class="panel-header flex-between">
        <h3>Banner Performance</h3>
        <select class="small-select">
          <option>This Month</option>
        </select>
      </div>
      
      <table class="perf-table">
        <thead>
          <tr>
            <th></th>
            <th>Views</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="section-name">Top Hero Banners</td>
            <td>{{ formatNumber(performance.top_hero?.views || 0) }}</td>
            <td>{{ formatNumber(performance.top_hero?.clicks || 0) }}</td>
          </tr>
          <tr>
            <td class="section-name">Top Carousel Banners</td>
            <td>{{ formatNumber(performance.top_carousel?.views || 0) }}</td>
            <td>{{ formatNumber(performance.top_carousel?.clicks || 0) }}</td>
          </tr>
          <tr>
            <td class="section-name">Middle Banners</td>
            <td>{{ formatNumber(performance.middle_banner?.views || 0) }}</td>
            <td>{{ formatNumber(performance.middle_banner?.clicks || 0) }}</td>
          </tr>
          <tr>
            <td class="section-name">Bottom Banners</td>
            <td>{{ formatNumber(performance.bottom_banner?.views || 0) }}</td>
            <td>{{ formatNumber(performance.bottom_banner?.clicks || 0) }}</td>
          </tr>
        </tbody>
      </table>
      
      <button class="btn btn-ghost view-analytics-btn mt-3">
        View Full Analytics <ArrowRight class="icon" />
      </button>
    </AppCard>

    <AppCard class="quick-actions-panel">
      <div class="panel-header">
        <h3>Quick Actions</h3>
      </div>
      <div class="quick-grid">
        <button class="quick-btn">
          <Upload class="quick-icon" />
          <span>Upload<br>Banner</span>
        </button>
        <button class="quick-btn">
          <Copy class="quick-icon" />
          <span>Bulk<br>Upload</span>
        </button>
        <button class="quick-btn">
          <LayoutTemplate class="quick-icon" />
          <span>Banner<br>Templates</span>
        </button>
        <button class="quick-btn">
          <CreditCard class="quick-icon" />
          <span>Plan &<br>Pricing</span>
        </button>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
import { ArrowRight, Upload, Copy, LayoutTemplate, CreditCard } from '@lucide/vue';
import AppCard from '../../../components/common/AppCard.vue';
import { formatNumber } from '../../../utils/formatters';

defineProps({
  rules: { type: Array, default: () => [] },
  performance: { type: Object, default: () => ({}) }
});
</script>

<style scoped>
.right-panels {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-header {
  margin-bottom: 16px;
}

.panel-header.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.panel-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

.small-select {
  padding: 2px 6px;
  font-size: 11px;
}

.city-pin-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.city-pin-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px 12px;
  align-items: center;
}

.city-name {
  font-size: 13px;
  color: var(--text-secondary);
  grid-column: 1;
  grid-row: 1;
}

.pin-count {
  font-size: 13px;
  text-align: right;
  grid-column: 2;
  grid-row: 1;
}

.current { font-weight: 600; color: var(--text-primary); }
.separator { color: var(--text-muted); margin: 0 2px; }
.limit { color: var(--text-muted); }

.progress-bar {
  grid-column: 1 / -1;
  grid-row: 2;
  height: 4px;
  background-color: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-fill.full {
  background-color: var(--warning-color);
}

.mt-3 { margin-top: 16px; }

.manage-pins-btn, .view-analytics-btn {
  width: 100%;
  color: var(--primary-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
}

.manage-pins-btn .icon, .view-analytics-btn .icon {
  width: 14px;
  height: 14px;
}

.perf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.perf-table th {
  text-align: right;
  color: var(--text-muted);
  font-weight: 500;
  padding-bottom: 8px;
}

.perf-table td {
  padding: 8px 0;
  text-align: right;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.perf-table td.section-name {
  text-align: left;
  color: var(--text-secondary);
}

.perf-table tbody tr:last-child td {
  border-bottom: none;
}

.quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: var(--bg-surface-sunken);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.quick-btn span {
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
}

.quick-icon {
  width: 24px;
  height: 24px;
  color: var(--text-secondary);
}

.quick-btn:hover .quick-icon {
  color: var(--primary-color);
}
</style>
