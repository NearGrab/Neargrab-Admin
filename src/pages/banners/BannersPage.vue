<template>
  <div class="banners-page">
    <div class="page-header">
      <div class="page-title">
        <h1>Banner Management <Info class="info-icon" /></h1>
        <div class="page-subtitle">Create, manage and pin banners on the home page by city and section.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline">
          <HelpCircle class="icon" /> How It Works
        </button>
        <button class="btn btn-outline">
          <BarChart2 class="icon" /> Analytics
        </button>
        <button class="btn btn-primary">
          <Plus class="icon" /> Create Banner
        </button>
      </div>
    </div>

    <BannerMetricGrid v-if="metrics" :totals="metrics" />
    
    <div class="two-col-layout">
      <div class="main-column">
        <div class="table-container">
          <div v-if="errorMessage" class="error-banner">
            <span>{{ errorMessage }}</span>
            <button class="btn-close" @click="errorMessage = null">&times;</button>
          </div>
          <BannerFilters @filter="handleFilter" />
          
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id" 
              class="tab-btn" 
              :class="{ active: activeTab === tab.id }"
              @click="setActiveTab(tab.id)"
            >
              {{ tab.label }}
              <span class="tab-badge" v-if="tab.count !== undefined">{{ tab.count }}</span>
            </button>
          </div>
          
          <BannerTable 
            :data="banners" 
            :loading="loading"
            :page="filters.page"
            :limit="filters.limit"
            :total="totalBanners"
            @update:page="filters.page = $event; loadBanners()"
            @update:limit="filters.limit = $event; loadBanners()"
            @action="handleAction"
          />
        </div>
      </div>
      
      <div class="side-column">
        <BannerPinnedPanel 
          :rules="pinRules" 
          :performance="performance"
        />
        
        <AppCard class="guidelines-panel mt-4">
          <div class="panel-header">
            <h3>Banner Guidelines</h3>
          </div>
          <div class="guideline-item">
            <span class="label">Recommended size:</span>
            <span class="value">{{ guidelines?.recommendedSize || '1920x600 px' }}</span>
          </div>
          <div class="guideline-item">
            <span class="label">Max file size:</span>
            <span class="value">{{ guidelines?.maxFileSize || '2MB' }}</span>
          </div>
          <div class="guideline-item">
            <span class="label">Formats:</span>
            <span class="value">{{ (guidelines?.formats || []).join(', ') }}</span>
          </div>
          
          <button class="btn btn-ghost view-guidelines-btn mt-3">
            View Guidelines <ArrowRight class="icon" />
          </button>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { HelpCircle, BarChart2, Plus, Info, ArrowRight } from '@lucide/vue';
import { bannerService } from '../../services/bannerService';
import { contentService } from '../../services/contentService';
import BannerMetricGrid from './components/BannerMetricGrid.vue';
import BannerFilters from './components/BannerFilters.vue';
import BannerTable from './components/BannerTable.vue';
import BannerPinnedPanel from './components/BannerPinnedPanel.vue';
import AppCard from '../../components/common/AppCard.vue';

const metrics = ref(null);
const pinRules = ref([]);
const performance = ref({});
const guidelines = ref(null);

const banners = ref([]);
const loading = ref(false);
const totalBanners = ref(0);
const errorMessage = ref(null);

const activeTab = ref('all');

const tabs = computed(() => [
  { id: 'all', label: 'All Banners' },
  { id: 'pinned', label: 'Pinned Banners', count: metrics.value?.pinnedBanners || 0 },
  { id: 'scheduled', label: 'Scheduled', count: metrics.value?.scheduled || 0 },
  { id: 'drafts', label: 'Drafts', count: metrics.value?.drafts || 0 },
  { id: 'expired', label: 'Expired', count: metrics.value?.expired || 0 },
  { id: 'inactive', label: 'Inactive', count: metrics.value?.inactive || 0 }
]);

const filters = reactive({
  search: '',
  city: 'all',
  section: 'all',
  status: 'all',
  device: 'all',
  page: 1,
  limit: 10
});

const loadInitialData = async () => {
  try {
    metrics.value = await bannerService.getMetrics();
    pinRules.value = await bannerService.getPinnedByCity();
    performance.value = await bannerService.getPerformance();
    
    const contentData = await contentService.getAppContent();
    guidelines.value = contentData.bannerGuidelines;
  } catch (err) {
    console.error('Failed to load initial banner data', err);
  }
};

const loadBanners = async () => {
  loading.value = true;
  try {
    const { data, total } = await bannerService.listBanners(filters);
    banners.value = data;
    totalBanners.value = total;
  } catch (err) {
    console.error('Failed to load banners', err);
  } finally {
    loading.value = false;
  }
};

const handleFilter = (newFilters) => {
  Object.assign(filters, newFilters);
  filters.page = 1;
  loadBanners();
};

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  filters.page = 1;
  
  if (tabId === 'all') {
    filters.status = 'all';
  } else if (tabId === 'pinned') {
    filters.status = 'pinned';
  } else if (tabId === 'scheduled') {
    filters.status = 'scheduled';
  } else if (tabId === 'drafts') {
    filters.status = 'draft';
  } else if (tabId === 'expired') {
    filters.status = 'expired';
  } else if (tabId === 'inactive') {
    filters.status = 'inactive';
  }
  
  loadBanners();
};

const handleAction = async ({ action, bannerId }) => {
  errorMessage.value = null;
  loading.value = true;
  try {
    if (action === 'approve-banner') {
      await bannerService.updateBanner(bannerId, { status: 'active' });
    } else if (action === 'pin-banner') {
      await bannerService.pinBanner(bannerId);
    } else if (action === 'unpin-banner') {
      await bannerService.unpinBanner(bannerId);
    } else if (action === 'deactivate-banner') {
      if (!confirm('Are you sure you want to deactivate this banner? It will no longer be visible on the customer application.')) {
        loading.value = false;
        return;
      }
      await bannerService.updateBanner(bannerId, { status: 'inactive' });
    }
    
    await loadBanners();
    await loadInitialData();
  } catch (err) {
    console.error(`Failed action ${action}`, err);
    errorMessage.value = err.message || `Failed to perform banner action ${action.replace('-', ' ')}.`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadInitialData();
  loadBanners();
});
</script>

<style scoped>
.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-title h1 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.tabs {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-badge {
  background: var(--bg-surface-sunken);
  color: var(--text-secondary);
  padding: 2px 6px;
  border-radius: 9999px;
  font-size: 11px;
}

.tab-btn.active .tab-badge {
  background: #e6f4ea;
  color: var(--primary-color);
}

.mt-4 { margin-top: 20px; }
.mt-3 { margin-top: 16px; }

.guideline-item {
  font-size: 13px;
  margin-bottom: 8px;
}

.guideline-item .label {
  color: var(--text-secondary);
  margin-right: 8px;
}

.guideline-item .value {
  color: var(--text-primary);
  font-weight: 500;
}

.view-guidelines-btn {
  width: 100%;
  color: var(--primary-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
}

.view-guidelines-btn .icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 1024px) {
  .side-column {
    order: -1;
  }
}

.error-banner {
  background-color: #FEF2F2;
  border: 1px solid var(--danger-color);
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
  padding: 0;
}
</style>
