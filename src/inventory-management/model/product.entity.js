import {generateUuid} from "../../shared/model/uuid.js";
import {ValidationError} from "../../shared/model/errors.js";

/**
 * Represents a product in an inventory.
 */
export class Product {
    /**
     * @constructor
     * Constructs a new product instance with the specified parameters.
     * @param name {string} - The Name of the product.
     * @param unitPrice {number} - The unit price of the product.
     * @param content {number} - The amount of content the product has in milliliters.
     * @param expirationDate {DateTime} - The expiration date of the product.
     * @param imageUrl {string} - The URL of the image about the product.
     * @param productType {string} - The type of the product. It can be vodka, whisky, etc.
     * @param currentStock {number} - The integer number of current products in the inventory. It cannot be less than 0.
     * @param minimumStock {number} - The minimum number of products can exist in the inventory before generating an alert in the system.
     * @param providerId {string} - The ID of the provider of this product.
     * @throws {ValidationError} Throws an error if `currentStock` or `minimumStock` is not a positive integer, or if `content` is not a positive number.
     * @return {Object} A new instance of the product with the specified attributes.
     */
    constructor({
                    name='',
                    unitPrice=0,
                    content=0,
                    expirationDate= null,
                    imageUrl='',
                    productType='',
                    currentStock=0,
                    minimumStock=0,
                    providerId=''
                })
    {
        if (!Number.isInteger(currentStock) || currentStock <= 0) {
            throw ValidationError('Current stock of product must be a positive integer number.')
        }

        if (!Number.isInteger(minimumStock) || minimumStock <= 0) {
            throw ValidationError('Minimum stock of product must be a positive integer number.')
        }

        if (content <= 0) {
            throw ValidationError('Content of product must be a positive number.')
        }

        this.id = generateUuid();
        this.name = name;
        this.unitPrice = unitPrice;
        this.content = content;
        this.expirationDate = expirationDate;
        this.imageUrl = imageUrl;
        this.productType = productType;
        this.currentStock = currentStock;
        this.minimumStock = minimumStock;
        this.state = "IN-INVENTORY";
        this.providerId = providerId;
    }

    get currentStock() { return this.currentStock; }

    get minimumStock() { return this.minimumStock; }

    set minimumStock(number) { this.minimumStock = number; }

    set addStock(number) { this.currentStock += number; }

    set removeStock(number) { this.currentStock -= number; }

    set name(newName) { this.name = newName; }

    set unitPrice(newUnitPrice) { this.unitPrice = newUnitPrice; }
}