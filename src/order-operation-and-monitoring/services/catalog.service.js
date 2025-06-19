import axios from 'axios';
import { Money} from "@/shared/model/money.js";
import { Currency} from "@/shared/model/currency.js";

const apiUrl = import.meta.env.VITE_API_URL;

export class CatalogService {
    async getCatalogByProfile(profileId) {
        const response = await axios.get(`${apiUrl}/catalogs?profileId=${profileId}`);
        return response.data;
    }

    async getCatalogItems(catalogId) {
        const response = await axios.get(`${apiUrl}/catalogItems?catalogId=${catalogId}`);
        return response.data.map(item => {
            const priceRaw = item.unitPrice;
            let amount = 0;
            let currencyCode = 'PEN';

            try {
                if (typeof priceRaw === 'number') {
                    amount = priceRaw;
                } else if (typeof priceRaw === 'object' && priceRaw !== null) {
                    amount = Number(priceRaw._amount ?? priceRaw.amount ?? 0);
                    currencyCode =
                        priceRaw._currency?._code ??
                        priceRaw._currency?.code ??
                        priceRaw.currency ??
                        'PEN';
                }

                if (!Number.isFinite(amount) || amount < 0) {
                    console.warn('⚠️ Invalid amount detected:', amount);
                    amount = 0;
                }

                const money = new Money({
                    amount,
                    currency: new Currency(currencyCode)
                });

                return {
                    ...item,
                    unitPrice: money
                };
            } catch (err) {
                return {
                    ...item,
                    unitPrice: new Money({ amount: 0, currency: new Currency('PEN') })
                };
            }
        });
    }

    async addCatalogItem(item) {
        const plainItem = {
            ...item,
            unitPrice: {
                _amount: item.unitPrice.amount,
                _currency: {
                    _code: item.unitPrice.currency.code
                }
            }
        };

        const response = await axios.post(`${apiUrl}/catalogItems`, plainItem);
        return response.data;
    }

    async getCatalogById(id) {
        const response = await axios.get(`${apiUrl}/catalogs/${id}`);
        return response.data;
    }

    async updateCatalog(catalog) {
        const response = await axios.put(`${apiUrl}/catalogs/${catalog.id}`, catalog);
        return response.data;
    }

    async deleteCatalogItem(id) {
        await axios.delete(`${apiUrl}/catalogItems/${id}`);
    }

    async getPublishedCatalogs() {
        const response = await axios.get(`${apiUrl}/catalogs?isPublished=true`);
        return response.data;
    }

    async getPublishedCatalogsByProfile(profileId) {
        const response = await axios.get(`${apiUrl}/catalogs?profileId=${profileId}&isPublished=true`);
        return response.data;
    }

    async createCatalog(catalog) {
        const response = await axios.post(`${apiUrl}/catalogs`, catalog);
        return response.data;
    }
}
