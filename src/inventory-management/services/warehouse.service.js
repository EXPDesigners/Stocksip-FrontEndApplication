import {generateUuid} from "@/shared/model/uuid.js";
import {WarehouseAssembler} from "@/inventory-management/services/warehouse.assembler.js";
import {BaseService} from "@/shared/services/base.service.js";
import axios from "axios";

/**
 * @class WarehouseService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class WarehouseService extends BaseService {

    accountEndpoint = '';
    accountWarehouseEndpoint = '';

    constructor() {
        super();
        /** @type {string} The API endpoint for user's warehouses */
        this.resourceEndpoint = import.meta.env.VITE_WAREHOUSE_ENDPOINT_PATH;
        this.accountEndpoint = import.meta.env.VITE_ACCOUNT_ENDPOINT_PATH;
        this.accountWarehouseEndpoint = import.meta.env.VITE_ACCOUNT_WAREHOUSES_ENDPOINT_PATH;
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
     * @returns {Promise<Object>} Created warehouse data
     * @param warehouseData
     * @param imageFile
     */
    async createWarehouse(warehouseData, imageFile) {

        const accountId = 'TEST_ACCOUNT_123';
        const endpoint = `${import.meta.env.VITE_BASE_API_URL}${this.accountWarehouseEndpoint.replace('{accountId}', accountId)}`;

        const formData = this.#createWarehouseFormData(warehouseData, imageFile);

        if (imageFile) {
            formData.append('Image', imageFile);
        }

        const response = await axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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
     * @param {string} warehouseId - The ID of the warehouse to update
     * @param {Object} warehouseData - The updated warehouse data
     * @param imageFile - The image file to upload
     * @returns {Promise<Object>} The updated warehouse data
     */
    async updateWarehouse(warehouseId, warehouseData, imageFile) {

        const endpoint = `${import.meta.env.VITE_BASE_API_URL}${this.resourceEndpoint}/${warehouseId}`;
        const formData = this.#createWarehouseFormData(warehouseData, imageFile);

        const response = await axios.put(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return response.data;
    }

    #createWarehouseFormData(warehouseData, imageFile) {
        const formData = new FormData();
        formData.append('Name', warehouseData.name);
        formData.append('Street', warehouseData.street);
        formData.append('City', warehouseData.city);
        formData.append('District', warehouseData.district);
        formData.append('PostalCode', warehouseData.postalCode);
        formData.append('Country', warehouseData.country);
        formData.append('MaxTemperature', warehouseData.maxTemperature);
        formData.append('MinTemperature', warehouseData.minTemperature);
        formData.append('Capacity', warehouseData.capacity);

        if (imageFile) {
            formData.append('Image', imageFile);
        }

        return formData;
    }
}