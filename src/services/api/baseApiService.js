// services/api/baseApiService.js
import httpClient from "./httpClient";

class BaseApiService {
  constructor(resource, options = {}) {
    this.resource = resource;
    this.client = httpClient;
    this.requireVendorId = options.requireVendorId || false; // Whether URL needs {vendorId}
    this.vendorIdInPath = options.vendorIdInPath || false; // Whether to include vendorId in path
  }

  // Get vendor ID from localStorage or store
  getVendorId() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.vendor_id;
  }

  // Build URL based on resource type
  buildUrl(path = "") {
    const vendorId = this.getVendorId();
    
    // If resource requires vendorId in URL (like clients)
    if (this.requireVendorId) {
      if (!vendorId) {
        throw new Error("Vendor ID not found");
      }
      return `/api/v1/vendors/${vendorId}${path}`;
    }
    
    // If resource is under vendors prefix but without ID (like quotes)
    if (this.vendorIdInPath) {
      return `/api/v1/vendors${path}`;
    }
    
    // Default: no vendor prefix
    return `/api/v1${path}`;
  }

  // CRUD operations
  async getAll(params = {}) {
    const url = this.buildUrl(`/${this.resource}`);
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async getById(id) {
    const url = this.buildUrl(`/${this.resource}/${id}`);
    const response = await this.client.get(url);
    return response.data;
  }

  async create(data) {
    const url = this.buildUrl(`/${this.resource}`);
    const response = await this.client.post(url, data);
    return response.data;
  }

  async update(id, data) {
    const url = this.buildUrl(`/${this.resource}/${id}`);
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete(id) {
    const url = this.buildUrl(`/${this.resource}/${id}`);
    const response = await this.client.delete(url);
    return response.data;
  }
}

export default BaseApiService;