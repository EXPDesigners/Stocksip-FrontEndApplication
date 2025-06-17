import axios from 'axios';
import { CareGuide } from '../model/care-guide.entity.js';

const API_URL = 'http://localhost:3000';

export const CareGuideService = {
    /**
     * Obtiene todas las guías de cuidado
     * @returns {Promise<CareGuide[]>}
     */
    async getAll() {
        try {
            console.log('Obteniendo guías...');
            const response = await axios.get(`${API_URL}/conservation`);
            console.log('Respuesta del servidor:', response.data);

            if (!response.data) {
                console.error('No hay datos en la respuesta');
                return [];
            }

            const guides = Array.isArray(response.data) ? response.data : [response.data];
            return guides.map(guide => {
                try {
                    return new CareGuide(guide);
                } catch (error) {
                    console.error('Error al crear guía:', error, guide);
                    return null;
                }
            }).filter(guide => guide !== null);
        } catch (error) {
            console.error('Error completo:', error);
            if (error.response) {
                console.error('Datos de error:', error.response.data);
                console.error('Estado:', error.response.status);
            }
            throw new Error('No se pudieron obtener las guías de cuidado');
        }
    },

    /**
     * Obtiene una guía por su ID
     * @param {string} id - ID de la guía
     * @returns {Promise<CareGuide>}
     */
    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/conservation/${id}`);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error al obtener la guía:', error);
            throw new Error('No se pudo obtener la guía de cuidado');
        }
    },

    /**
     * Crea una nueva guía
     * @param {Object} guideData - Datos de la guía
     * @returns {Promise<CareGuide>}
     */
    async create(guideData) {
        try {
            const response = await axios.post(`${API_URL}/conservation`, guideData);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error al crear la guía:', error);
            throw new Error('No se pudo crear la guía de cuidado');
        }
    },

    /**
     * Actualiza una guía existente
     * @param {string} id - ID de la guía
     * @param {Object} guideData - Datos actualizados de la guía
     * @returns {Promise<CareGuide>}
     */
    async update(id, guideData) {
        try {
            const response = await axios.put(`${API_URL}/conservation/${id}`, guideData);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error al actualizar la guía:', error);
            throw new Error('No se pudo actualizar la guía de cuidado');
        }
    },

    /**
     * Elimina una guía
     * @param {string} id - ID de la guía
     * @returns {Promise<void>}
     */
    async delete(id) {
        try {
            await axios.delete(`${API_URL}/conservation/${id}`);
        } catch (error) {
            console.error('Error al eliminar la guía:', error);
            throw new Error('No se pudo eliminar la guía de cuidado');
        }
    },

    /**
     * Filtra las guías por tipo
     * @param {string} type - Tipo de licor
     * @returns {Promise<CareGuide[]>}
     */
    async getByType(type) {
        try {
            const response = await axios.get(`${API_URL}/conservation?type=${type}`);
            return response.data.map(guide => new CareGuide(guide));
        } catch (error) {
            console.error('Error al filtrar las guías:', error);
            throw new Error('No se pudieron filtrar las guías de cuidado');
        }
    },

    /**
     * Busca guías por nombre
     * @param {string} name - Nombre a buscar
     * @returns {Promise<CareGuide[]>}
     */
    async searchByName(name) {
        try {
            const response = await axios.get(`${API_URL}/conservation?name_like=${name}`);
            return response.data.map(guide => new CareGuide(guide));
        } catch (error) {
            console.error('Error al buscar las guías:', error);
            throw new Error('No se pudieron buscar las guías de cuidado');
        }
    }
};