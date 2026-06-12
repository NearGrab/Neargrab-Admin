import contentData from '../data/content.json';
import apiClient from './apiClient';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contentService = {
  async getAppContent() {
    await delay(200);
    return contentData;
  },

  async getDashboardSummary() {
    const { data } = await apiClient.get('/api/v1/admin/dashboard');
    return data;
  }
};

