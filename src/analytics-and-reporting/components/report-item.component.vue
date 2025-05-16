<script>
export default {
  name: "report-item",
  props: {
    report: Object,
    index: Number
  },
  emits: ['edit', 'delete']
}
</script>

<template>
  <tr>
    <td>{{ report.nombre }}</td>
    <td>{{ report.tipo }}</td>
    <td>S/. {{ report.precio.toFixed(2) }}</td>
    <td>{{ report.cantidad }}</td>
    <td>{{ report.fecha }}</td>
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