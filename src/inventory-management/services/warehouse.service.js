import {BaseService} from "../../shared/services/base.service.js";
import {generateUuid} from "@/shared/model/uuid.js";
import {WarehouseAssembler} from "@/inventory-management/services/warehouse.assembler.js";

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
        return WarehouseAssembler.toEntitiesFromResources(response.data);
    }

    /**
     * Get a warehouse by ID
     * @param id
     * @returns {Promise<Object>} The warehouse data
     */
    async getWarehouseById(id) {
        const response = await this.getById(id);
        return WarehouseAssembler.toEntityFromResource(response.data);
    }

    /**
     * Update a warehouse
     * @param warehouse
     * @returns {Promise<Object>} Created warehouse data
     */
    async createWarehouse(warehouse) {
        const adaptedWarehouse = {
            id: warehouse.id || generateUuid(),
            ...warehouse
        };
        const response = await this.create(adaptedWarehouse);
        return response.data;
    }

    /**
     * Delete a warehouse
     * @param {string} id - The ID of the warehouse to delete
     * @returns {Promise<Object>} The deleted warehouse data
     */
    async deleteWarehouse(id) {
        const response = await this.delete(id);
        return response.data;
    }

    /**
     * Update a warehouse
     * @param {string} id - The ID of the warehouse to update
     * @param {Object} warehouse - The updated warehouse data
     * @returns {Promise<Object>} The updated warehouse data
     */
    async updateWarehouse(id, warehouse) {
        const warehouseToUpdate = {
            ...warehouse,
            id: id
        };
        const response = await this.update(id, warehouseToUpdate);
        return response.data;
    }
}