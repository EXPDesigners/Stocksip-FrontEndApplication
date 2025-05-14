<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue"
import {InputText as PvInputText} from "primevue";
import {CascadeSelect} from "primevue";

export default {
  name: "product-create-and-edit",
  components: {PvInputText, CreateAndEdit},
  props: {
    product: null,
    visible: false
  },
  emits: ['cancel-requested', 'save-requested'],
  data() {
    return {
      submitted: false,
    }
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      this.submitted = true;
      this.$emit('save-requested', this.product);
    }
  }
}
</script>

<template>
  <create-and-edit :entity="product" :visible="visible" entity-name="Product"
                   @cancel-action-requested="onCancelRequested"
                   @save-action-requested="onSaveRequested">
    <template #content>
      <div class="p-fluid">
        <div class="field mt-5">
          <pv-float-label>
            <label for="name"> Name </label>
            <pv-input-text id="name" v-model="product.name" :class="{ 'p-invalid': submitted && !product.name }"/>

            <label for="unitPrice"> Unit Price </label>
            <pv-input-text id="unitPrice" v-model="product.unitPrice" :class="{ 'p-invalid': submitted && !product.unitPrice }"/>

            <label for="content"> Content </label>
            <pv-input-text id="content" v-model="product.content" :class="{ 'p-invalid': submitted && !product.content }"/>

            <label for="expirationDate"> Expiration Date </label>
            <pv-input-text id="expirationDate" v-model="product.expirationDate" :class="{ 'p-invalid': submitted && !product.expirationDate }"/>

            <label for="productType"> Product Type </label>
            <CascadeSelect v-model="product.productType" :options="['Vodka', 'Tequila', 'Wine']" optionLabel="cname" option-group-label="name"
                           class="w-56" placeholder="Select a Type"/>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>

</style>