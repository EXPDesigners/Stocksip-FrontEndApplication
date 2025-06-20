<template>
  <Card class="product-card">
    <template #header>
      <img :src="displayImageUrl" alt="Product Image" class="product-img" />
    </template>
    <template #title>
      <div class="product-name">
        {{ displayName }}
      </div>
    </template>
    <template #subtitle>{{ displayBrand }} - {{ displayLiquorType }}</template>
    <template #content>
      <div class="product-content">
        <p><strong>Price:</strong> {{ displayPrice }}</p>
        <p><strong>Min Stock:</strong> {{ displayMinimumStock }}</p>
      </div>
    </template>
    <template #footer>
      <div class="footer-buttons">
        <Button
            icon="pi pi-pencil"
            class="p-button-sm p-button-secondary"
            @click="$emit('edit', product.id)"
        />
        <Button
            icon="pi pi-trash"
            class="p-button-sm p-button-danger"
            @click="$emit('delete', product.id)"
        />
      </div>
    </template>
  </Card>
</template>


<script>
import Card from 'primevue/card';
import Button from 'primevue/button';

export default {
  name: 'ProductItem',
  components: { Card, Button },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    displayName() {
      return this.product.name;
    },
    displayBrand() {
      return this.product.brandName;
    },
    displayLiquorType() {
      return this.product.liquorType;
    },
    displayPrice() {
      const amount = this.product.updatedUnitPriceAmount ?? this.product.unitPriceAmount ?? 0;
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
      }).format(amount);
    },
    displayMinimumStock() {
      return this.product.updatedMinimumStock ?? this.product.minimumStock ?? 0;
    },
    displayImageUrl() {
      return (this.product.updatedImageUrl ?? this.product.imageUrl) || 'https://via.placeholder.com/400x200?text=No+Image';
    }
  }
};
</script>



<style scoped>
.product-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  width: 100%;
  background-color: #fff;
}
.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.product-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #5A033A;
  margin-bottom: 0.5rem;
}

.product-content {
  font-size: 1rem;
  color: #4E4E4E;
}
</style>
