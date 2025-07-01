<template>

  <div class="products-bg">
    <side-navbar />
    <div class="products-main">
      <toolbar-content :pageTitle="$t('products.title')"/>
      <div class="products-content">

        <Button
            label="New Product"
            icon="pi pi-plus"
            class="p-button-success"
            @click="goToCreate"
        />
        <div class="product-management-content">
          <ProductListComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import Button from 'primevue/button';
import ProductListComponent from "@/inventory-management/components/product-list.component.vue";
import { useRouter } from 'vue-router';
import WarehouseList from "@/inventory-management/components/warehouse-list.component.vue";

export default {
  name: 'ProductManagementComponent',
  components: {
    WarehouseList,
    ProductListComponent,
    SideNavbar,
    ToolbarContent,
    Button,
  },
  setup() {
    const router = useRouter();

    const goToCreate = () => {
      router.push({ name: 'ProductCreate' });
    };

    return {
      goToCreate
    };
  }
};
</script>

<style scoped>

.products-bg {
  background: #F7EDDC;
  min-height: 100vh;
  display: flex;
}

.products-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.products-content {
  padding: 2rem;
}


.product-management-content {
  padding: 1rem 2rem;
}

.p-button-success {
  background-color: #5A033A;
  border: none;
  color: white;
  font-weight: bold;
  margin-top: 3rem;
  border-radius: 40px;
  padding: 1rem 1.5rem;
}
.p-button-success:hover {
  background-color: #6E0081;
}

.empty-products {
  text-align: center;
  margin-top: 2rem;
}

.empty-title {
  font-size: 2.5rem;
  color: #790b38;
}
</style>
