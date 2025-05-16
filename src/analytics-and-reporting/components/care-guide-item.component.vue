<script>
export default {
  name: "care-guide-item",
  props: {
    guide: Object
  },
}
</script>

<template>
  <tr>
    <td><img :src="guide.imagen" class="thumb" /></td>
    <td>
      <a @click="$emit('ver-detalle', guide)" class="product-name">{{ guide.nombre }}</a>
    </td>
    <td>{{ guide.tipo }}</td>
    <td>{{ guide.descripcion }}</td>
    <td>
      <button class="btn editar" @click="$emit('editar', guide)">Edit</button>
    </td>
  </tr>
</template>

<style scoped>
.thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}
.product-name {
  color: #6E0081;
  cursor: pointer;
  text-decoration: underline;
}
.btn.editar {
  background-color: #5A033A;
  color: white;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>