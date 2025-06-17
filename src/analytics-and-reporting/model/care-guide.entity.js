export class CareGuide {
    constructor({ id, nombre, tipo, descripcion, imagen, detalles }) {
        this.id = id
        this.nombre = nombre
        this.tipo = tipo
        this.descripcion = descripcion
        this.imagen = imagen
        this.detalles = detalles || {
            temperatura: '16 - 20 °C',
            almacenamiento: 'Lugar fresco, seco y sin luz solar directa',
            duracion: 'Hasta 3 años',
            comentarios: 'No almacenar junto a productos con olores fuertes',
            entregado: false
        }
    }
}