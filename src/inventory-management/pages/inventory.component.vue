<script>
import ProductManagement from "@/inventory-management/components/product-management.component.vue";
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";

export default {
  name: "inventory",
  components: {ToolbarContent, SideNavbar, ProductManagement}
}
</script>

<template>
  <div class="inventory-bg">
    <side-navbar />
    <div class="inventory-main">
      <div class="inventory-title">
        <toolbar-content :pageTitle="'Inventory'" />
      </div>
      <product-management/>
    </div>
  </div>
</template>

<style scoped>
.inventory-bg {
  background: #f7eddc;
  min-height: 100vh;
  width: 100vw;
  display: flex;
}


.inventory-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>