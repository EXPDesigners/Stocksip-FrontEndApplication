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
        return response.data.map(item => ({
            ...item,
            unitPrice: Number(item.unitPrice)
        }));
    }


    async addCatalogItem(item) {
        const plainItem = {
            ...item,
            unitPrice: Number(item.unitPrice)
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
