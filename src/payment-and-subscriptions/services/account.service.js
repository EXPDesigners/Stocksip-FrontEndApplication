import http from '@/shared/services/http.instance.js';              // Axios con interceptor JWT
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';

export class AccountService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_BASE_API_URL;
        this.endpoint = import.meta.env.VITE_ACCOUNT_ENDPOINT_PATH; // Ej: '/api/v1/accounts'
    }

    getCurrentAccountId() {
        const store = useAuthenticationStore();
        return store.currentAccountId;
    }

    async getAccountById(accountId) {
        const response = await http.get(`${this.baseUrl}${this.endpoint}/${accountId}`);
        return response.data;
    }

    async getCatalogsByAccount(accountId, published = true) {
        const url = `${this.baseUrl}/api/v1/accounts/${accountId}/catalogs`;
        const response = await http.get(url, {
            params: { published }
        });
        return response.data;
    }
}