<template>
  <div class="visits-page">
    <div class="page-header">
      <div class="page-title">
        <h1>Page Visits Analytics</h1>
        <div class="page-subtitle">Track and analyze route traffic and unique device metrics across the platform.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" @click="fetchVisits" :disabled="loading">
          <RefreshCw class="icon" :class="{ 'spin': loading }" /> Refresh Data
        </button>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="metrics-grid" v-if="summaryMetrics">
      <div class="metric-card">
        <div class="metric-info">
          <span class="metric-title">Total Page Views</span>
          <span class="metric-value">{{ summaryMetrics.totalPageViews }}</span>
        </div>
        <div class="metric-icon-wrapper views">
          <Eye class="metric-icon" />
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-info">
          <span class="metric-title">Unique Visitors</span>
          <span class="metric-value">{{ summaryMetrics.totalUniqueVisitors }}</span>
        </div>
        <div class="metric-icon-wrapper unique-users">
          <Users class="metric-icon" />
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-info">
          <span class="metric-title">Unique Visited Routes</span>
          <span class="metric-value">{{ summaryMetrics.uniqueRoutes }}</span>
        </div>
        <div class="metric-icon-wrapper routes">
          <Compass class="metric-icon" />
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-info">
          <span class="metric-title">Top Visited Path</span>
          <span class="metric-value path-val">{{ summaryMetrics.topPath || 'N/A' }}</span>
        </div>
        <div class="metric-icon-wrapper top">
          <TrendingUp class="metric-icon" />
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-container">
      <div class="table-header-filters">
        <div class="search-bar">
          <Search class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by path (e.g. /explore)..." 
            class="search-input"
          />
        </div>
      </div>

      <div v-if="errorMessage" class="error-banner">
        <span>{{ errorMessage }}</span>
        <button class="btn-close" @click="errorMessage = null">&times;</button>
      </div>

      <div class="table-wrapper">
        <table class="visits-table">
          <thead>
            <tr>
              <th class="th-path">Route Path</th>
              <th class="th-numeric">Total Visits</th>
              <th class="th-numeric">Unique Visitors</th>
              <th class="th-bar">Traffic Share</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-8">
                <div class="loading-spinner"></div>
                <p class="mt-2 text-secondary">Loading page visit statistics...</p>
              </td>
            </tr>
            <tr v-else-if="filteredVisits.length === 0">
              <td colspan="4" class="text-center py-8 text-secondary">
                No route visits matching search query found.
              </td>
            </tr>
            <tr v-else v-for="visit in filteredVisits" :key="visit.path">
              <td class="td-path">
                <code class="path-code">{{ visit.path }}</code>
              </td>
              <td class="td-numeric font-medium">{{ visit.totalVisits }}</td>
              <td class="td-numeric font-medium">{{ visit.uniqueVisitors }}</td>
              <td class="td-bar">
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: getPercentage(visit.totalVisits) + '%' }"></div>
                  <span class="progress-label">{{ getPercentage(visit.totalVisits) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Eye, Compass, TrendingUp, Search, RefreshCw, Users } from '@lucide/vue';
import { analyticsService } from '../../services/analyticsService';

const visits = ref([]);
const totalUniqueVisitors = ref(0);
const loading = ref(false);
const errorMessage = ref(null);
const searchQuery = ref('');

const fetchVisits = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const data = await analyticsService.getRouteVisitsSummary();
    visits.value = data?.visits || [];
    totalUniqueVisitors.value = data?.totalUniqueVisitors || 0;
  } catch (err) {
    console.error('Failed to load page visits:', err);
    errorMessage.value = 'Failed to load page visit statistics. Please try again.';
  } finally {
    loading.value = false;
  }
};

const totalAllVisits = computed(() => {
  return visits.value.reduce((sum, v) => sum + (v.totalVisits || 0), 0);
});

const summaryMetrics = computed(() => {
  if (visits.value.length === 0) {
    return { totalPageViews: 0, uniqueRoutes: 0, topPath: '', totalUniqueVisitors: 0 };
  }
  return {
    totalPageViews: totalAllVisits.value,
    uniqueRoutes: visits.value.length,
    topPath: visits.value[0]?.path || '',
    totalUniqueVisitors: totalUniqueVisitors.value
  };
});

const filteredVisits = computed(() => {
  if (!searchQuery.value.trim()) {
    return visits.value;
  }
  const q = searchQuery.value.toLowerCase().trim();
  return visits.value.filter(v => v.path.toLowerCase().includes(q));
});

const getPercentage = (visitsCount) => {
  if (totalAllVisits.value === 0) return 0;
  return Math.round((visitsCount / totalAllVisits.value) * 100);
};

onMounted(() => {
  fetchVisits();
});
</script>

<style scoped>
.visits-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color, #E5E7EB);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary, #6B7280);
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary, #111827);
}

.path-val {
  font-size: 16px;
  font-family: monospace;
  word-break: break-all;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon {
  width: 24px;
  height: 24px;
}

.metric-icon-wrapper.views {
  background: #EFF6FF;
  color: #2563EB;
}

.metric-icon-wrapper.routes {
  background: #F5F3FF;
  color: #7C3AED;
}

.metric-icon-wrapper.top {
  background: #ECFDF5;
  color: #059669;
}

.metric-icon-wrapper.unique-users {
  background: #FEF3C7;
  color: #D97706;
}

.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color, #E5E7EB);
  padding: 24px;
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.table-header-filters {
  margin-bottom: 20px;
}

.search-bar {
  position: relative;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary, #9CA3AF);
  width: 18px;
  height: 18px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 38px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #D1D5DB);
  font-size: 14px;
  color: var(--text-primary, #111827);
  outline: none;
}

.search-input:focus {
  border-color: var(--primary-color, #0B4A26);
  box-shadow: 0 0 0 2px rgba(11, 74, 38, 0.1);
}

.table-wrapper {
  overflow-x: auto;
}

.visits-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.visits-table th, .visits-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color, #F3F4F6);
}

.visits-table th {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary, #4B5563);
  background: #F9FAFB;
}

.th-path {
  width: 45%;
}

.th-numeric, .td-numeric {
  text-align: right;
  width: 15%;
}

.th-bar {
  width: 25%;
}

.path-code {
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  background: #F3F4F6;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: var(--primary-color, #0B4A26);
  word-break: break-all;
}

.font-medium {
  font-weight: 500;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  height: 8px;
  background: var(--primary-color, #0B4A26);
  border-radius: 4px;
  transition: width 0.3s ease;
  min-width: 4px;
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #4B5563);
  min-width: 32px;
}

.error-banner {
  background-color: #FEF2F2;
  border: 1px solid #FCA5A5;
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
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #E5E7EB;
  border-top-color: var(--primary-color, #0B4A26);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.text-center {
  text-align: center;
}

.py-8 {
  padding-top: 32px;
  padding-bottom: 32px;
}

.mt-2 {
  margin-top: 8px;
}

.text-secondary {
  color: var(--text-secondary, #6B7280);
}
</style>
