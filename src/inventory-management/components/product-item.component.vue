<script>
import { Product } from "@/inventory-management/model/product.entity.js";

export default {
  name: "product-item",
  props: {
    product: Product,
    index: Number
  },
  emits: ['edit', 'delete']
}
</script>

<template>
  <tr>
    <td>{{ product.name }}</td>
    <td>S/. {{ product.unitPrice.toFixed(2) }}</td>
    <td>{{ product.content }}</td>
    <td>{{ product.expirationDate }}</td>
    <td>{{ product.currentStock }}</td>
    <td>
      <button class="action-btn edit" @click="$emit('edit', index)">Edit</button>
      <button class="action-btn delete" @click="$emit('delete', index)">Delete</button>
    </td>
  </tr>
</template>

<style scoped>
.action-btn {
  border: none;
  padding: 0.4rem 0.8rem;
  margin-right: 0.4rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}
.edit {
  background: #5A033A;
  color: white;
}
.delete {
  background: #5A033A;
  color: white;
}
</style>