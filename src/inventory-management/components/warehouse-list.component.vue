<script>
import {Warehouse} from "@/inventory-management/model/warehouse.entity.js";
import WarehouseItem from "@/inventory-management/components/warehouse-item.component.vue";

export default {
  name: "warehouse-list",
  components: {WarehouseItem},
  props: {warehouses: {type: Array[Warehouse], required: true}},
}
</script>

<template>
  <div class="grid-container">
    <div class="grid">
      <div v-for="warehouse in warehouses" :key="warehouse.warehouseId" class="grid-item">
        <warehouse-item :warehouse="warehouse" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.grid-item {
  aspect-ratio: 1/1;
}
</style>