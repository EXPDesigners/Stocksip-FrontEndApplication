import {BaseService} from "@/shared/services/base.service.js";

/**
 * @class ProductService
 * @description Service class for handling CRUD operations on products using HTTP requests
 */
export class ProductService extends BaseService {
    //super();

    /** @type {string} The API endpoint for products */
    resourceEndpoint = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH;
}