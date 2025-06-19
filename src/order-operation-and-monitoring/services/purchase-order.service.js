import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL + '/purchase-orders';

export class PurchaseOrderService {
    async createPurchaseOrder(order) {
        const response = await axios.post(apiUrl, order);
        return response.data;
    }

    async getAll() {
        const response = await axios.get(apiUrl);
        return response.data;
    }

    async update(id, order) {
        const response = await axios.put(`${apiUrl}/${id}`, order);
        return response.data;
    }
}
