<script>
import {Product} from "../model/product.entity.js";
import {ProductService} from "../services/product.service.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import ProductItemCreateAndEditDialog from "../pages/product-create-and-edit.component.vue";
import httpInstance from "@/shared/services/http.instance.js";

export default {
  name: "product-management",
  components: {ProductItemCreateAndEditDialog, DataManager},

  data() {
    return {
      title: {singular: "Product", plural: "Products"},

      /**
       * @type {Array<Product>}
       * @description Collection of all products loaded from the server
       */
      products: [],

      /**
       * @type {Product}
       * @description Currently selected category for editing or creating
       */
      product: new Product({}),

      /**
       * @type {ProductService|null}
       * @description Service for handling API requests related to products
       */
      productService: null,

      /**
       * @type {Boolean}
       * @description Controls the visibility of the create/edit dialog
       */
      createAndEditDialogIsVisible: false,

      /**
       * @type {Boolean}
       * @description Indicates whether the form is in edit mode (true) or create mode (false)
       */
      isEdit: false,

      /**
       * @type {Boolean}
       * @description Tracks whether the form has been submitted for validation purposes
       */
      submitted: false,
    }
  },
  methods: {
    /**
     * Displays a success toast notification
     * @param {string} message - The message to display in the notification
     */
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3500});
    },

    /**
     * Finds the index of a product item in the product array by its ID
     * @param {string} id - The ID of the product to find
     * @returns {number} The index of the product in the array, or -1 if not found
     */
    findIndexById(id) {
      return this.products.findIndex(product => product.id === id);
    },

    /**
     * Handles the request to create a new category
     * Prepares the form for creating a new category and shows the dialog
     */
    onNewItem() {
      this.product = new Product({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
      console.log(this.createAndEditDialogIsVisible);
    },

    /**
     * Handles the request to edit an existing category
     * Prepares the form with the selected category data and shows the dialog
     * @param {Product} item - The category to edit
     */
    onEditItem(item) {
      this.product = new Product(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    /**
     * Handles the request to delete a category
     * Sets the current category and initiates the delete operation
     * @param {Product} item - The category to delete
     */
    onDeleteItem(item) {
      this.product = {...item};
      this.deleteProduct();
    },

    /**
     * Handles the cancel action from the create/edit dialog
     * Closes the dialog and resets form state
     */
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    /**
     * Handles the save action from the create/edit dialog
     * Validates the form and calls the appropriate create or update method
     * @param {Product} item - The category data from the form
     */
    onSaveRequested(item) {
      console.log('onSaveRequested');
      this.submitted = true;
      if (this.product.name.trim()) {
        if (item.id) {
          this.updateProduct();
        } else {
          this.createProduct();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },

    /**
     * Creates a new category via the API
     * Adds the created category to the local array on success
     */
    createProduct() {
      this.productService.create(this.product).then(response => {
        let product = new Product(response.data);
        this.products.push(product);
        this.notifySuccessfulAction("Product added successfully!");
      }).catch(error => console.error(error));
    },

    /**
     * Updates an existing category via the API
     * Updates the local category in the array on success
     */
    updateProduct() {
      this.productService.update(this.product.id, this.product).then(response => {
        console.log('updateProduct');
        let index = this.findIndexById(this.product.id);
        this.products[index] = new Product(response.data);
        console.log(this.products);
        this.notifySuccessfulAction("Product Updated!");
      }).catch(error => console.error(error));
    },

    /**
     * Deletes the current category via the API
     * Removes the category from the local array on success
     */
    deleteProduct() {
      this.productService.delete(this.product.id).then(() => {
        let index = this.findIndexById(this.product.id);
        this.products.splice(index, 1);
        this.notifySuccessfulAction("Product Deleted");
      }).catch(error => console.error(error));
    }
  },

  /**
   * Lifecycle hook called after the component instance is created
   * Initializes the category service and loads all categories from the server
   */
  created() {
    this.productService = new ProductService();
    console.log(this.productService.getAll());

    this.productService.getAll().then(response => {
      Object.keys(response.data).map((product) => {
        this.products.push(product);
        console.log(this.products);
      });

      /**this.products = response.data.map(product => new Product(product));
      console.log(this.products);*/
    }).catch(error => console.error(error));
  }
}
</script>

<template>
  <div class="w-full">
    <data-manager :title=title
                  :items="products"
                  @new-item-requested="onNewItem"
                  @edit-item-requested="onEditItem($event)"
                  @delete-item-requested="onDeleteItem($event)">
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="ID" style="min-width: 5rem"/>
        <pv-column :sortable="true" field="name" header="Name" style="min-width: 5rem"/>
        <pv-column :sortable="true" field="unitPrice" header="Unit Price" style="min-width: 10rem"/>
        <pv-column :sortable="true" field="content" header="Content (ml)" style="min-width: 10rem"/>
        <pv-column :sortable="true" field="expirationDate" header="Expiration Date" style="min-width: 10rem"/>
        <pv-column :sortable="true" field="currentStock" header="Current Stock" style="min-width: 10rem"/>
      </template>
    </data-manager>
    <product-item-create-and-edit-dialog
        :edit="isEdit"
        :item="product"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"/>
  </div>
</template>

<style scoped>
</style>