/**
 * @class CareGuide
 * @description Represents a care guide for alcoholic beverages
 */
export class CareGuide {
    /**
     * @param {Object} data
     * @param {number|string} data.id
     * @param {string} data.name
     * @param {string} data.type
     * @param {string} data.description
     * @param {string} data.imageUrl
     */
    constructor(data) {
        if (!data) {
            throw new Error('Los datos de la guía son requeridos');
        }

        this.id = data.id;
        this.name = data.name || '';
        this.type = data.type || '';
        this.description = data.description || '';
        this.imageUrl = data.imageUrl || '';

        this.validate();
    }

    validate() {
        if (!this.id) {
            throw new Error('El ID de la guía es requerido');
        }
        if (!this.name) {
            throw new Error('El nombre de la guía es requerido');
        }
        if (!this.type) {
            throw new Error('El tipo de la guía es requerido');
        }
        if (!this.description) {
            throw new Error('La descripción de la guía es requerida');
        }
    }

    /**
     * @returns {Object} Guide data in a format suitable for API
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            description: this.description,
            imageUrl: this.imageUrl
        };
    }

    /**
     * @returns {Object} Guide data with parsed details
     */
    toDetailedJSON() {
        const details = this.parseDescription();
        return {
            ...this.toJSON(),
            temperature: details.temperature,
            storage: details.storage,
            duration: details.duration,
            comments: details.comments
        };
    }

    parseDescription() {
        const tempMatch = this.description.match(/Temperatura recomendada: ([\d-]+°C)/);
        const storageMatch = this.description.match(/Almacenar en (.+?)\./);
        const durationMatch = this.description.match(/Duración después de abierto: (.+?)\./);
        const commentsMatch = this.description.match(/Comentarios: (.+?)(?:\.|$)/);

        return {
            temperature: tempMatch ? tempMatch[1] : 'No especificada',
            storage: storageMatch ? storageMatch[1] : 'No especificado',
            duration: durationMatch ? durationMatch[1] : 'No especificada',
            comments: commentsMatch ? commentsMatch[1] : 'No especificados'
        };
    }
}