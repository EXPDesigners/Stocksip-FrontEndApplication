import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; // Backend Api
const accountProducts = import.meta.env.VITE_ACCOUNT_PRODUCTS_ENDPOINT_PATH;
const productsEndpoint = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH;

export class ProductService {

    async getById(productId) {
        const endpoint = `${baseApiUrl}${productsEndpoint}/${productId}`;
        const response = await axios.get(endpoint);
        return response.data;
    }

    async createProduct(productData, imageFile) {
        const accountId = 'test-acc';
        const endpoint = `${baseApiUrl}${accountProducts.replace('{accountId}', accountId)}`;

        const formData = this.#createProductFormData(productData, imageFile);

        const response = await axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async updateProduct(productId, productData, imageFile) {
        try {
            const endpoint = `${baseApiUrl}${productsEndpoint}/${productId}`;
            const formData = this.#createProductFormData(productData, imageFile);

            const response = await axios.put(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async delete(productId) {
        const response = await axios.delete(`${baseApiUrl}${productsEndpoint}/${productId}`);
        return response.data;
    }

    // Backend API methods
    async getAllByAccountId(accountId) {
        const endpoint = accountProducts.replace('{accountId}', accountId);
        const url = `${baseApiUrl}${endpoint}`;
        return await axios.get(url);
    }

    #createProductFormData(productData, imageFile) {
        const formData = new FormData();
        formData.append('Name', productData.name);
        formData.append('LiquorType', productData.liquorType);
        formData.append('BrandName', productData.brandName);
        formData.append('UnitPriceAmount', productData.unitPriceAmount);
        formData.append('MinimumStock', productData.minimumStock);
        if (imageFile) {
            formData.append('Image', imageFile);
        }

        return formData;
    }
}
