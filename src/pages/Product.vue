<script setup>
import Product from '@/components/Product.vue'
const props = defineProps({
  id: Number,
})


</script>

<template>
  <Product :id="id" />
</template>

<style scoped></style>
