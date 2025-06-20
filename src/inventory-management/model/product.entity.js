import {generateUuid} from "@/shared/model/uuid.js";

export class Product {
    constructor({ name, brandName, liquorType, unitPriceAmount, minimumStock, imageUrl, providerId }) {
        this.id = generateUuid();
        this.name = name;
        this.brandName = brandName;
        this.liquorType = liquorType;
        this.unitPriceAmount = unitPriceAmount;
        this.minimumStock = minimumStock;
        this.imageUrl = imageUrl;
        this.providerId = providerId;
    }
}
