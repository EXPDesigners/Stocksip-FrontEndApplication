import {generateUuid} from "@/shared/model/uuid.js";
import {ValidationError} from "@/shared/model/errors.js";

/**
 * @constructor
 * Represents a product in an inventory system.
 * @param name {string} - The name of the product.
 * @param unitPrice {number} - The unit price of the product.
 * @param content {number} - The number of milliliters the product has.
 * @param expirationDate {DateTime} - The date of expiration the product has.
 * @param imageUrl {string} - The URL of the image about the product.
 * @param productType {string} - The type of product. It can be a whisky, vodka, tequila, etc.
 * @param currentStock {number} - The current number of products in the inventory.
 * @param minimumStock {number} - The minimum stock of existing products in the inventory before generating an alert.
 * @param providerId {string} - The Identifier of the provider.
 */
export class Product {
    constructor({
                    id='',
                    name='',
                    unitPrice=0,
                    content=0,
                    expirationDate= "",
                    imageUrl='',
                    productType='',
                    currentStock=0,
                    state='',
                    minimumStock=0,
                    providerId=''
                })
    {
        /**
        if (!Number.isInteger(currentStock) || currentStock <= 0) {
            throw new ValidationError('Current stock of product must be a positive integer number.');
        }

        if (!Number.isInteger(minimumStock) || minimumStock <= 0) {
            throw new ValidationError('Minimum stock of product must be a positive integer number.');
        }

        if (content <= 0) {
            throw new ValidationError('Content of product must be a positive number.');
        }
            */

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
}