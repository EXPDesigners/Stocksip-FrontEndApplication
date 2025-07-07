import httpInstance from "@/shared/services/http.instance.js";

const accountStatusEndpoint = import.meta.env.VITE_ACCOUNT_STATUS_ENDPOINT_PATH;

export class AccountService {

    async getAccountStatus(accountId) {
        const endpoint = accountStatusEndpoint.replace('{accountId}', accountId);
        const response = await httpInstance.get(endpoint, {
        });
        console.log("🧾 Response from account status:", response.data);
        return response.data;
    }
}