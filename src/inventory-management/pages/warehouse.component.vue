<script>
import WarehouseList from "@/inventory-management/components/warehouse-list.component.vue";
import {WarehouseService} from "@/inventory-management/services/warehouse.service.js";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import SideNavbar from "@/public/components/side-navbar.vue";
import {Button as PvButton} from "primevue";
import {Warehouse} from "@/inventory-management/model/warehouse.entity.js";

export default {
  name: "warehouses",
  components: {PvButton, SideNavbar, ToolbarContent, WarehouseList},
  data() {
    return {
      warehouses: [],
      warehouseApi: new WarehouseService()
    };
  },
  methods: {
    async getWarehouses() {
      this.error = null;
      try {
        const service = new WarehouseService();
        const response = await service.getAll();
        this.warehouses = response.data.map(item => new Warehouse({
          id: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
          location: item.location,
          city: item.city,
          state: item.state,
          postalCode: item.postalCode,
          capacity: item.capacity,
          profileId: item.profileId
        }));
      } catch (error) {
        this.error = "Failed to load warehouses";
        console.error(error);
      }
    },
    navigateToCreate() {
      this.$router.push('/warehouses/create');
    },
  },
  created() {
    this.getWarehouses();
  }
}
</script>

<template>
  <div class="warehouse-bg">
    <side-navbar />
    <div class="warehouse-main">
      <toolbar-content :pageTitle="'Warehouse'"/>
      <div class="warehouse-content">
        <warehouse-list :warehouses="warehouses"></warehouse-list>

        <div class="floating-action-container">
          <pv-button
              icon="pi pi-plus"
              :label="($t('warehouses.create'))"
              class="create-button p-button-raised p-button-rounded"
              @click="navigateToCreate"
              aria-label="Create a new Warehouse"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-bg {
  background: #F7EDDC;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  position: relative;
}

.warehouse-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warehouse-content {
    padding: 2rem;
    gap: 2rem;
}

.floating-action-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.create-button {
  background-color: #790b38;
  color: white;
  border: none;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.create-button:hover {
  background-color: #46062c !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  color: white !important;
  filter: brightness(1.1);
  box-shadow: 0 3px 5px rgba(89, 3, 58, 0.3);
}

</style>