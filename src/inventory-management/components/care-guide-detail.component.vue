<script>
export default {
  name: 'care-guide-detail',
  props: {
    guide: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  computed: {
    details() {
      return this.guide.toDetailedJSON();
    }
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Detalles del Producto</h2>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <div v-if="guide" class="product-card">
        <div class="header">
          <div>
            <h3>{{ guide.name }}</h3>
            <p>Tipo de Licor: {{ guide.type }}</p>
          </div>
          <img :src="guide.imageUrl" class="product-image" alt="Imagen del producto" />
        </div>

        <ul class="info-list">
          <li><i class="pi pi-thermometer"></i> Temperatura: {{ details.temperature }}</li>
          <li><i class="pi pi-sun"></i> Almacenamiento: {{ details.storage }}</li>
          <li><i class="pi pi-clock"></i> Duración: {{ details.duration }}</li>
          <li><i class="pi pi-comment"></i> Comentarios: {{ details.comments }}</li>
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
  margin-bottom: 1.5rem;
}
.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.info-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}
.info-list li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.info-list i {
  color: #666;
  font-size: 1.2rem;
}
</style>