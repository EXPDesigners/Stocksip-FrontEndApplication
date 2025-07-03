<script>
import CareGuideItem from "@/inventory-management/components/care-guide-item.component.vue";

export default {
  name: "care-guide-list",
  props: {
    guides: Array
  },
  components: {
    CareGuideItem
  }
}
</script>

<template>
  <table class="guide-table">
    <thead>
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Type</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <care-guide-item
        v-for="item in guides"
        :key="item.id"
        :guide="item"
        @ver-detalle="$emit('ver-detalle', $event)"
        @editar="$emit('editar', $event)"
    />
    </tbody>
  </table>
</template>

<style scoped>
.guide-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}
.guide-table th,
.guide-table td {
  padding: 1rem;
  text-align: left;
}
</style>