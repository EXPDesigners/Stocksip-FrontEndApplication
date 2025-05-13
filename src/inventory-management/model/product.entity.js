import {generateUuid} from "../../shared/model/uuid.js";
import {ValidationError} from "../../shared/model/errors.js";

export class Product {
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

    get unitPrice() { return this.unitPrice; }

    get expirationDate() { return this.expirationDate; }

    get content() { return this.content; }

    get state() { return this.state; }

    set minimumStock(number) { this.minimumStock = number; }

    set addStock(number) { this.currentStock += number; }

    set removeStock(number) { this.currentStock -= number; }

    set editName(newName) { this.name = newName; }

    set modifyUnitPrice(newUnitPrice) { this.unitPrice = newUnitPrice; }

    set newState(newState) { this.state = newState; }

    canEdit() { return this.state === "IN-INVENTORY"; }
}