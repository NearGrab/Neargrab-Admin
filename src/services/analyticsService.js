import apiClient from './apiClient';

export const analyticsService = {
  /**
   * Fetch route-level page visits and unique visitor counts.
   */
  async getRouteVisitsSummary() {
    const { data } = await apiClient.get('/api/v1/admin/analytics/visits');
    return data;
  }
};
