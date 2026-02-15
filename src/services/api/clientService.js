// services/api/clientsService.js
import BaseApiService from './baseApiService';

class ClientsService extends BaseApiService {
  constructor() {
    super('clients');
  }

  // Add custom methods specific to clients
  async getClientStats() {
    return this.get('/clients/stats');
  }

  async getClientQuotes(clientId) {
    return this.get(`/clients/${clientId}/quotes`);
  }

  async toggleClientStatus(clientId) {
    return this.patch(`/clients/${clientId}/toggle-status`, {});
  }
}

export default new ClientsService();