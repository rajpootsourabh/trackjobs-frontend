// services/api/quotesService.js
import BaseApiService from './baseApiService';

class QuotesService extends BaseApiService {
  constructor() {
    super('quotes');
  }

  async sendQuote(quoteId) {
    return this.post(`/quotes/${quoteId}/send`, {});
  }

  async duplicateQuote(quoteId) {
    return this.post(`/quotes/${quoteId}/duplicate`, {});
  }

  async downloadQuote(quoteId, format = 'pdf') {
    const response = await this.client.get(`/quotes/${quoteId}/download`, {
      params: { format },
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `quote-${quoteId}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  }
}

export default new QuotesService();