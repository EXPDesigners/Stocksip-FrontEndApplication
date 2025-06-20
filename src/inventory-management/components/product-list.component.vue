<template>
  <div class="product-grid">
    <div
        v-for="product in products"
        :key="product.id"
        class="product-grid-tile"
    >
      <ProductItem
          :product="product"
          @edit="goToEditProduct"
          @delete="onDeleteProduct"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductItem from "@/inventory-management/components/product-item.component.vue";
import { ProductService } from "@/inventory-management/services/product.service.js";
import userService from "@/authentication/services/user.service.js";

export default {
  name: 'ProductListComponent',
  components: {
    ProductItem
  },
  setup() {
    const products = ref([]);
    const router = useRouter();
    const productService = new ProductService();

    const loadProducts = async () => {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) return;

      try {
        products.value = await productService.getAllByProviderId(currentUser.profileId);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    const goToEditProduct = (productId) => {
      router.push({ name: 'ProductEdit', params: { productId } });
    };

    const onDeleteProduct = async (productId) => {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await productService.delete(productId);
          await loadProducts();
        } catch (err) {
          console.error('Error deleting product:', err);
        }
      }
    };

    onMounted(loadProducts);

    return {
      products,
      goToEditProduct,
      onDeleteProduct
    };
  }
};
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
.product-grid-tile {
  display: flex;
}
</style>
