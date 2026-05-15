import contentData from '../data/content.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contentService = {
  async getAppContent() {
    await delay(200);
    return contentData;
  }
};
