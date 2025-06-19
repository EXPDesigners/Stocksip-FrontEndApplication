import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL + '/purchase-orders';

export class PurchaseOrderService {
    async createPurchaseOrder(order) {
        const response = await axios.post(apiUrl, order);
        return response.data;
    }

    async getAll() {
        console.log('Fetching orders from:', apiUrl);
        const response = await axios.get(apiUrl);
        console.log('Data received:', response.data);
        return response.data;
    }

    async update(id, order) {
        const response = await axios.put(`${apiUrl}/${id}`, order);
        return response.data;
    }
}
