import httpInstance from "../../shared/services/http.instance.js";

/**
 * @class InventoryService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class InventoryService {
    super();

    /** @type {string} The API endpoint for inventories */
    resourceEndpoint = import.meta.env.VITE_INVENTORIES_ENDPOINT_PATH;
}