export class Report {
    constructor({ nombre, tipo, precio, cantidad, fecha }) {
        this.nombre = nombre || ''
        this.tipo = tipo || ''
        this.precio = parseFloat(precio || 0)
        this.cantidad = parseInt(cantidad || 0)
        this.fecha = fecha || new Date().toISOString().substring(0, 10)
    }

    get total() {
        return this.precio * this.cantidad
    }
}