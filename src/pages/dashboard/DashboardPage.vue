<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="page-title">
        <h1>Dashboard</h1>
        <div class="page-subtitle">Welcome back, Admin! Here's what's happening on Neargrab.</div>
      </div>
      <div class="page-actions">
        <div class="date-picker">
          May 18 - Jun 16, 2025
          <Calendar class="icon" />
        </div>
        <button class="btn btn-outline" @click="refreshData" :disabled="loading">
          <RefreshCw class="icon" :class="{ 'spinning': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading && !content" class="loading-state">
      <RefreshCw class="icon spinning" />
      <span>Loading dashboard data...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-card">
        <h3>Failed to Load Dashboard</h3>
        <p>{{ error }}</p>
        <button class="btn btn-primary btn-sm" @click="loadData">Try Again</button>
      </div>
    </div>

    <template v-else-if="content">
      <DashboardMetricGrid :totals="content.totals" />

      <div class="two-col-layout">
        <div class="main-column">
          <OverviewChart />
          
          <div class="mini-charts-grid">
            <MiniTrendChart 
              title="New Users" 
              :value="content.totals?.newUsers || 0" 
              :trend="content.totals?.newUsersTrend || 0" 
              color="#10B981" 
            />
            <MiniTrendChart 
              title="New Shops" 
              :value="content.totals?.newShops || 0" 
              :trend="content.totals?.newShopsTrend || 0" 
              color="#10B981" 
            />
            <MiniTrendChart 
              title="Products Added" 
              :value="content.totals?.productsAdded || 0" 
              :trend="content.totals?.productsAddedTrend || 0" 
              color="#F59E0B" 
            />
          </div>
        </div>
        
        <div class="side-column">
          <LeadsBySource :data="content.leadsBySource" />
          <TopCities :data="content.topCities" />
          <RecentActivity :data="content.recentActivity" />
        </div>
      </div>

      <SystemSummary :data="content.systemSummary" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Calendar, RefreshCw } from '@lucide/vue';
import { contentService } from '../../services/contentService';
import DashboardMetricGrid from './components/DashboardMetricGrid.vue';
import OverviewChart from './components/OverviewChart.vue';
import LeadsBySource from './components/LeadsBySource.vue';
import TopCities from './components/TopCities.vue';
import RecentActivity from './components/RecentActivity.vue';
import SystemSummary from './components/SystemSummary.vue';
import MiniTrendChart from '../../components/charts/MiniTrendChart.vue';

const content = ref(null);
const loading = ref(false);
const error = ref(null);

const loadData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await contentService.getDashboardSummary();
    content.value = data;
  } catch (err) {
    console.error('Failed to load dashboard data', err);
    error.value = err.message || 'Something went wrong while fetching dashboard summary.';
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.date-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.date-picker .icon {
  width: 16px;
  height: 16px;
}

.btn .icon {
  width: 16px;
  height: 16px;
}

.btn .icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 16px;
}

.loading-state .icon {
  width: 32px;
  height: 32px;
  color: var(--primary-color);
  animation: spin 1s linear infinite;
}

.error-state {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.error-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-md);
}

.error-card h3 {
  color: var(--danger-color);
  margin-top: 0;
  margin-bottom: 8px;
}

.error-card p {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 14px;
}

.mini-charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1280px) {
  .mini-charts-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

