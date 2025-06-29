import axios from 'axios';
import { Money } from '@/shared/model/money.js';
import { Currency } from '@/shared/model/currency.js';

const apiUrl = import.meta.env.VITE_API_URL;

export class ProductService {
    async getAllByProviderId(providerId) {
        const response = await axios.get(`${apiUrl}/products`, {
                params: { providerId }
        });

        return response.data.map(p => this._mapProduct(p));
    }

    async getById(productId) {
        const response = await axios.get(`${apiUrl}/products/${productId}`);
        return this._mapProduct(response.data);
    }

    async create(product) {
        const payload = {
            name: product.name,
            brandName: product.brandName,
            liquorType: product.liquorType,
            unitPriceAmount: product.unitPriceAmount,
            minimumStock: product.minimumStock,
            imageUrl: product.imageUrl,
            providerId: product.providerId
        };
        const response = await axios.post(`${apiUrl}/products`, payload);
        return this._mapProduct(response.data);
    }

    async update(productId, fullProduct) {
        const response = await axios.put(`${apiUrl}/products/${productId}`, fullProduct);
        return this._mapProduct(response.data);
    }

    async delete(productId) {
        await axios.delete(`${apiUrl}/products/${productId}`);
    }

    async getExitsByProductId(productId) {
        const response = await axios.get(`${apiUrl}/products/${productId}/exits`);
        return response.data;
    }

    _mapProduct(product) {
        let amount = 0;
        let currencyCode = 'PEN';

        try {
            const price = product.unitPrice ?? product.unitPriceAmount;
            if (typeof price === 'number') {
                amount = price;
            } else if (typeof price === 'object' && price !== null) {
                amount = Number(price._amount ?? price.amount ?? 0);
                currencyCode =
                    price._currency?._code ?? price._currency?.code ?? price.currency ?? 'PEN';
            }

            if (!Number.isFinite(amount) || amount < 0) {
                amount = 0;
            }

        } catch (err) {
            amount = 0;
            currencyCode = 'PEN';
        }

        return {
            ...product,
            unitPrice: new Money({ amount, currency: new Currency(currencyCode) })
        };
    }
}
