// Modelo de datos para un plan de reabastecimiento
export default class ResupplyPlan {
  constructor({ id, productos, frecuencia, fechaVencimiento, estado }) {
    this.id = id;
    this.productos = productos; // string
    this.frecuencia = frecuencia; // 'Semanal' | 'Quincenal' | 'Mensual'
    this.fechaVencimiento = fechaVencimiento; // string (ISO)
    this.estado = estado; // 'Activo' | 'Inactivo'
  }
} 