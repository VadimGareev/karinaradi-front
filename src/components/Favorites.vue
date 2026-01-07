<script setup>
import ProductItem from '@/components/ProductItem.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const products = ref([])

const loadProducts = async () => {
  try {
    // если у тебя бэкенд умеет фильтровать по slug — подставь соответствующий эндпоинт
    const url = 'https://1150afc2fccb82e5.mokky.dev/products'

    const { data } = await axios.get(url)

    // data может быть массивом или объектом — стандартный защитный код:
    const arr = Array.isArray(data) ? data : (data?.data ?? [])

    // ФИЛЬТРУЕМ: оставляем только записи, у которых есть корректный id.
    // Это предотвращает ошибку Missing required param "id".
    products.value = arr.filter((p) => p && p.id !== undefined && p.id !== null)

    // предупреждение в консоль если что-то отфильтровалось
    const skipped = arr.filter((p) => !p || p.id == null)
    if (skipped.length) console.warn('Пропущены продукты без id:', skipped)
  } catch (err) {
    console.error('Ошибка загрузки товаров:', err)
    products.value = []
  }
}

// загрузка при монтировании и при смене slug в URL
onMounted(() => loadProducts())

function onToggleFavorite(item) {
  products.value = products.value.filter((p) => p.id !== item.id)
}
</script>

<template>
  <section class="wish-list-header">
    <div class="wish-list-title"><h1>Wish list</h1></div>
  </section>

  <section class="wish-list-body">
    <div class="product-grid-first" v-auto-animate>
      <template v-if="products.length">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="{ name: 'product', params: { id: product.id } }"
          class="product-link"
        >
          <ProductItem v-bind="product" @toggle-favorite="onToggleFavorite" />
        </RouterLink>
      </template>

      <div v-else class="empty">Товаров не найдено.</div>
    </div>
  </section>
</template>

<style scoped></style>
