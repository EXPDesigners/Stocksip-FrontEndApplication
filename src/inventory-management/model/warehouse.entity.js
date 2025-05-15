import {generateUuid} from "../../shared/model/uuid.js";

/**
 * Class representing a warehouse amount the bounded context inventory-management.
 * @module warehouse
 * @param {string} warehouseId - The unique identifier of the warehouse.
 * @param {string} name - The name of the warehouse.
 * @param {string} imageUrl - The URL of the image that refers to the warehouse.
 * @param {string} location - The physical location of the warehouse.
 * @param {string} city - The city where the warehouse is located.
 * @param {string} state - The state where the warehouse is located.
 * @param {string} country - The country where the warehouse is located.
 * @param {number} capacity - The physical space the warehouse uses in cubic meters.
 * @param {string} profileId - The ID of the person that owns the warehouse.
 */
export class Warehouse {
    constructor({
        warehouseId = '',
        name = '',
        imageUrl = '',
        location ='',
        city = '',
        state = '',
        country = '',
        capacity = 0,
        profileId = ''
                }) {
        this.warehouseId = generateUuid();
        this.name = name;
        this.imageUrl = imageUrl;
        this.location = location;
        this.city = city;
        this.state = state;
        this.country = country;
        this.capacity = capacity;
        this.userId = userId;

    }
}