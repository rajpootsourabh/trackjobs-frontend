// features/clients/services/clientService.js
import BaseApiService from "../../../services/api/baseApiService";
import {
  transformClientFromApi,
  transformClientForApi,
} from "../utils/clientTransformers";

class ClientService extends BaseApiService {
  constructor() {
    super("clients");
  }

  async getAll(params = {}) {
    const response = await super.getAll(params);
    
    // Transform each client in the data array
    return {
      data: response.data.map(transformClientFromApi),
      pagination: {
        total: response.meta.total,
        perPage: response.meta.per_page,
        currentPage: response.meta.current_page,
        totalPages: response.meta.total_pages,
      },
    };
  }

  async getById(id) {
    const response = await super.getById(id);
    // Transform single client
    return transformClientFromApi(response.data);
  }

  async create(data) {
    // Transform form data to API format
    const apiData = transformClientForApi(data);
    console.log("Sending to API:", apiData);
    
    const response = await super.create(apiData);
    // Transform response back to form format
    return transformClientFromApi(response.data);
  }

  async update(id, data) {
    // Transform form data to API format
    const apiData = transformClientForApi(data);
    console.log("Updating with:", apiData);
    
    const response = await super.update(id, apiData);
    // Transform response back to form format
    return transformClientFromApi(response.data);
  }
}

export default new ClientService();