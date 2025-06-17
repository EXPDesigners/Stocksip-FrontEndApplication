<script>

export default {
  name: 'care-guide-detail',
  props: {
    producto: Object
  },
  emits: ['close']
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Product detail</h2>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <div v-if="producto" class="product-card">
        <div class="header">
          <div>
            <h3>{{ producto.nombre }}</h3>
            <p>Type of Liquor: {{ producto.tipo }}</p>
          </div>
          <img :src="producto.imagen" class="product-image" />
        </div>

        <ul class="info-list">
          <li><i class="pi pi-thermometer"></i> Temperature: {{ producto.detalles.temperatura }}</li>
          <li><i class="pi pi-sun"></i> Storage: {{ producto.detalles.almacenamiento }}</li>
          <li><i class="pi pi-clock"></i> Duration: {{ producto.detalles.duracion }}</li>
          <li><i class="pi pi-comment"></i> Comments: {{ producto.detalles.comentarios }}</li>
          <li>
            <input type="checkbox" v-model="producto.detalles.entregado" />
            Change status to delivered
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}
.product-card {
  padding: 1rem 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-image {
  width: 100px;
  height: auto;
  border-radius: 8px;
}
.info-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}
.info-list li {
  margin-bottom: 0.8rem;
}
</style>