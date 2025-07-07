import httpInstance from "@/shared/services/http.instance.js";

const accountStatusEndpoint = import.meta.env.VITE_ACCOUNT_STATUS_ENDPOINT_PATH;

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

    async getAccountStatus(accountId) {
        const endpoint = accountStatusEndpoint.replace('{accountId}', accountId);
        const response = await httpInstance.get(endpoint, {
        });
        console.log("🧾 Response from account status:", response.data);
        return response.data;
    }
}