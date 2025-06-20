<template>
  <div class="resupply-plan-header">
    <h1>Resupply plan</h1>
    <div class="header-actions">
      <input type="text" placeholder="Buscar..." v-model="search" />
      <button @click.prevent="$emit('nuevo-plan')">New Plan</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResupplyPlanHeader',
  data() {
    return {
      search: ''
    }
  }
}
</script>

<style scoped>
.resupply-plan-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
input[type="text"] {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  background: #6c186f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}
h1{
  font-size: 3rem;
  font-weight: bold;
  color: #6F0082;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}
</style> 