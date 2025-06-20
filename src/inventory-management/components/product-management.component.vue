<template>
  <SideNavbar>

    <Button
        label="New Product"
        icon="pi pi-plus"
        class="p-button-success"
        @click="goToCreate"
    />
    <div class="product-management-content">
      <ProductListComponent />
    </div>
  </SideNavbar>
</template>

<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import Button from 'primevue/button';
import ProductListComponent from "@/inventory-management/components/product-list.component.vue";
import { useRouter } from 'vue-router';

export default {
  name: 'ProductManagementComponent',
  components: {
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
</style>
