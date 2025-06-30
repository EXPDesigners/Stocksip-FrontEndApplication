import httpInstance from "../../shared/services/http.instance.js";
import {BaseService} from "@/shared/services/base.service.js";
import axios from "axios";

/**
 * @class InventoryService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class InventoryService extends BaseService {

    warehouseProductsEndpoint = '';
    stockAdditionEndpoint = '';
    stockSubtractionEndpoint = '';

    constructor() {
        super();
        /** @type {string} The API endpoint to manage inventories */
        this.resourceEndpoint = import.meta.env.VITE_BASE_API_URL;
        this.warehouseProductsEndpoint = import.meta.env.VITE_WAREHOUSE_PRODUCTS_ENDPOINT_PATH;
        this.stockAdditionEndpoint = import.meta.env.VITE_INVENTORY_PRODUCTS_ADDITION_ENDPOINT;
        this.stockSubtractionEndpoint = import.meta.env.VITE_INVENTORY_PRODUCTS_SUBSTRACTION_ENDPOINT;

        console.log('✅ stockAdditionEndpoint loaded:', this.stockAdditionEndpoint);
    }

    async getAllProductsByWarehouseId(warehouseId) {
        const endpoint = this.warehouseProductsEndpoint.replace('{warehouseId}', warehouseId);
        const url = `${import.meta.env.VITE_BASE_API_URL}${endpoint}`;
        const response = await axios.get(url);
        return response.data;
    }

    async addStock(productId, warehouseId, addedQuantity, stockExpirationDate) {
        try {
            const endpoint = `warehouses/${warehouseId}/inventories${this.stockAdditionEndpoint.replace('{productId}', productId)}`;

            const url = `${this.resourceEndpoint}${endpoint}`;

            const response = await httpInstance.put(url, {
                stockExpirationDate,
                addedQuantity
            });

            return response.data;
        } catch (error) {
            console.error('Error adding stock:', error);
            throw this.handleApiError(error);
        }
    }

    async subtractStock(productId, warehouseId, removedQuantity, expirationDate) {
        try {
            const endpoint = `warehouses/${warehouseId}/inventories${this.stockSubtractionEndpoint.replace('{productId}', productId)}`;

            const url = `${this.resourceEndpoint}${endpoint}`;

            const response = await httpInstance.put(url, {
                expirationDate,
                removedQuantity
            });

            return response.data;
        } catch (error) {
            console.error('Error subtracting stock:', error);
            throw this.handleApiError(error);
        }
    }

    /**
     * Handle API errors consistently
     */
    handleApiError(error) {
        if (error.response) {
            return new Error(`Server error: ${error.response.status} - ${error.response.data.message}`);
        } else if (error.request) {
            return new Error('Network error - No se recibió respuesta del servidor');
        } else {
            return new Error('Request error - La solicitud no pudo ser enviada');
        }
    }
}