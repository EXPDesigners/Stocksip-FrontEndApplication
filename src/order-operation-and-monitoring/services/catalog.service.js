import http from '@/shared/services/http.instance.js';

const apiUrl = import.meta.env.VITE_BASE_API_URL;

export class CatalogService {

    async getCatalogsByAccount(accountId, onlyPublished = false) {
        const params = { accountId };
        if (onlyPublished) params.published = true;

        const { data } = await http.get('/catalogs', { params });
        return data;
    }
    async getPublishedCatalogs() {
        const { data } = await http.get('/api/v1/catalogs?published=true');
        return data;
    }

    async getCatalogById(catalogId) {
        const { data } = await http.get(`/api/v1/catalogs/${catalogId}`);
        return data;
    }

    async createCatalog(catalog) {
        const { data } = await http.post('/catalogs', catalog); // baseURL ya es /api/v1
        return data;
    }

    async updateCatalog(catalogId, catalog) {
        const { data } = await http.put(`/catalogs/${catalogId}`, catalog);
        return data;
    }

    async getCatalogItems(catalogId) {
        const { data } = await http.get('/catalogs/catalogitems', {
            params: { catalogId }
        });
        return data;
    }
    async addCatalogItem(item) {
        const { data } = await http.post('/catalogs/catalogitems', item);
        return data;
    }
    async deleteCatalogItem(itemId) {
        await http.delete(`/catalogs/catalogitems/${itemId}`);
    }
}