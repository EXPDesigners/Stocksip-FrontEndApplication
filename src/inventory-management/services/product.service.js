import httpInstance from "../../shared/services/http.instance.js";

/**
 * @class ProductService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class ProductService {
    /** @type {string} The API endpoint for products */
    resourceEndpoint = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH;

    /**
     * Retrieves all products
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of categories
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    /**
     * Retrieves a product by its ID
     * @param {string} id - The ID of the product to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the product object
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Creates a new product
     * @param {Object} resource - The category object to create
     * @param {string} resource.name - The name of the product
     * @param {number} resource.unitPrice - The unit price of the product
     * @param {number} resource.content - The content of the product
     * @param {string} resource.productType - The product type.
     * @param {number} resource.currentStock - The current stock of the product.
     * @param {number} resource.minimumStock - The minimum stock of the product.
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created category
     */
    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    /**
     * Updates an existing product
     * @param {string} id - The ID of the product to update
     * @param {Object} resource - The updated product data
     * @param {string} resource.name - The updated name of the product
     * @param {number} resource.unitPrice - The updated unit price of the product
     * @param {number} resource.content - The updated content of the product
     * @param {string} resource.productType - The updated product type.
     * @param {number} resource.currentStock - The updated current stock of the product.
     * @param {number} resource.minimumStock - The updated minimum stock of the product.
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated category
     */
    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    /**
     * Deletes a product by its ID
     * @param {string} id - The ID of the product to delete
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the product is deleted
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}