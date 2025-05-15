import {BaseService} from "../../shared/services/base.service.js";

/**
 * @class WarehouseService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class WarehouseService extends BaseService {
    constructor() {
        super();
        /** @type {string} The API endpoint for user's warehouses */
        this.resourceEndpoint = import.meta.env.VITE_WAREHOUSE_ENDPOINT_PATH;
    }

    /**
     * Get all warehouses
     * @returns {Promise<Array>} List of warehouses
     */
    async getWarehouses() {
        const response = await this.getAll();
        return response.data;
    }
}