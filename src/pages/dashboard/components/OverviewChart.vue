<template>
  <AppCard class="overview-chart">
    <div class="chart-header">
      <div class="chart-title">
        <h3>Overview</h3>
        <Info class="info-icon" />
      </div>
      <select class="chart-select">
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
    </div>
    
    <div class="chart-legend">
      <div class="legend-item">
        <span class="dot" style="background-color: #10B981"></span> Users
      </div>
      <div class="legend-item">
        <span class="dot" style="background-color: #0B4A26"></span> Shops
      </div>
      <div class="legend-item">
        <span class="dot" style="background-color: #F59E0B"></span> Leads
      </div>
    </div>

    <!-- For MVP, we render a static SVG chart visually matching the screenshot -->
    <div class="chart-body">
      <div class="y-axis">
        <span>100K</span>
        <span>80K</span>
        <span>60K</span>
        <span>40K</span>
        <span>20K</span>
        <span>0</span>
      </div>
      <div class="chart-content">
        <!-- Grid lines -->
        <div class="grid-line" v-for="i in 5" :key="i"></div>
        <div class="grid-line bottom"></div>
        
        <!-- Placeholder lines using SVG to match visual -->
        <svg viewBox="0 0 500 200" preserveAspectRatio="none" class="chart-svg">
          <!-- Leads (Yellow) -->
          <polyline points="0,90 50,70 100,80 150,75 200,65 250,70 300,75 350,65 400,60 450,70 500,80" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- Users (Green) -->
          <polyline points="0,130 50,110 100,120 150,115 200,125 250,130 300,125 350,115 400,110 450,120 500,130" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- Shops (Dark Green) -->
          <polyline points="0,160 50,140 100,150 150,145 200,155 250,160 300,155 350,145 400,140 450,150 500,160" fill="none" stroke="#0B4A26" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <div class="x-axis">
          <span>May 18</span>
          <span>May 25</span>
          <span>Jun 01</span>
          <span>Jun 08</span>
          <span>Jun 16</span>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { Info } from '@lucide/vue';
import AppCard from '../../../components/common/AppCard.vue';
</script>

<style scoped>
.overview-chart {
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-title h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.chart-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.chart-body {
  display: flex;
  height: 250px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 16px;
  font-size: 11px;
  color: var(--text-muted);
  text-align: right;
  width: 40px;
}

.chart-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.grid-line {
  flex: 1;
  border-top: 1px dashed var(--border-color);
}

.grid-line.bottom {
  border-top: 1px solid var(--border-color);
  flex: 0;
  height: 0;
}

.chart-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 24px); /* Subtract x-axis height */
}

.x-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 11px;
  color: var(--text-muted);
}
</style>
