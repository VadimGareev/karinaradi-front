<script setup>
import ProductItem from '@/components/ProductItem.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

/* ===============================
   PLACEHOLDER FACTORY
================================ */
function ph(id, type, text) {
  return {
    id,
    placeholder: true,
    placeholderType: type,
    placeholderText: text,
  }
}

/* ===============================
   STATE
================================ */
const firstRow = ref(null)
const secondLeft = ref(null)
const secondRight = ref(null)
const thirdRow = ref(null)

/* ===============================
   DATA FETCH
================================ */
onMounted(async () => {
  try {
    const { data } = await axios.get('https://1150afc2fccb82e5.mokky.dev/products')

    buildGrid(data)
  } catch (e) {
    console.error(e)
  }
})

/* ===============================
   GRID BUILDER (ГЛАВНОЕ)
================================ */
function buildGrid(list) {
  let i = 0

  /* ---------- FIRST ROW ---------- */
  if (list.length >= 2) {
    firstRow.value = [
      list[i++],
      list[i++],
      ph('ph1', 'pink', 'Будь <br> уникальной'),
      list[i++] ?? null,
    ].filter(Boolean)
  }

  /* ---------- SECOND ROW ---------- */
  if (list.length >= i + 1) {
    secondLeft.value = list[i++]

    secondRight.value = [
      list[i++] ?? null,
      ph('ph2', 'black', 'Сияй'),
      ph('ph3', 'pink', 'Будь <br> яркой'),
      list[i++] ?? null,
    ].filter(Boolean)
  }

  /* ---------- THIRD ROW ---------- */
  if (list.length >= i + 2) {
    thirdRow.value = [
      list[i++] ?? null,
      ph('ph4', 'black', 'Свети'),
      list[i++] ?? null,
      list[i++] ?? null,
    ].filter(Boolean)
  }
}

/* ===============================
   HANDLERS
================================ */
function onToggleFavorite(item) {
  const update = (p) => {
    if (p && p.id === item.id) {
      p.isFavorite = !p.isFavorite
    }
  }

  firstRow.value?.forEach(update)
  secondRight.value?.forEach(update)
  update(secondLeft.value)
  thirdRow.value?.forEach(update)
}
</script>

<template>
  <section class="products">
    <h2>
      <div class="header-products">
        <span class="involve-products">Хиты</span>
        <span class="denistina-products">нового сезона</span>
      </div>
    </h2>

    <!-- FIRST ROW -->
    <div v-if="firstRow" class="product-grid-first">
      <template v-for="p in firstRow" :key="p.id">
        <RouterLink
          v-if="!p.placeholder"
          :to="{ name: 'product', params: { id: p.id } }"
          class="product-link"
        >
          <ProductItem v-bind="p" @toggle-favorite="onToggleFavorite" />
        </RouterLink>

        <ProductItem v-else v-bind="p" placeholder>
          <template #placeholder>
            <p v-html="p.placeholderText"></p>
          </template>
        </ProductItem>
      </template>
    </div>

    <!-- SECOND ROW -->
    <div v-if="secondLeft && secondRight" class="product-grid-second">
      <div class="product-grid-second-left">
        <RouterLink :to="{ name: 'product', params: { id: secondLeft.id } }" class="product-link">
          <ProductItem
            v-bind="secondLeft"
            variant="second-left"
            :imgHeight="920"
            @toggle-favorite="onToggleFavorite"
          />
        </RouterLink>
      </div>

      <div class="product-grid-second-right">
        <template v-for="p in secondRight" :key="p.id">
          <RouterLink
            v-if="!p.placeholder"
            :to="{ name: 'product', params: { id: p.id } }"
            class="product-link"
          >
            <ProductItem v-bind="p" variant="second-right" />
          </RouterLink>

          <ProductItem v-else v-bind="p" placeholder variant="second-right">
            <template #placeholder>
              <p v-html="p.placeholderText"></p>
            </template>
          </ProductItem>
        </template>
      </div>
    </div>

    <!-- THIRD ROW -->
    <div v-if="thirdRow" class="product-grid-first">
      <template v-for="p in thirdRow" :key="p.id">
        <RouterLink
          v-if="!p.placeholder"
          :to="{ name: 'product', params: { id: p.id } }"
          class="product-link"
        >
          <ProductItem v-bind="p" />
        </RouterLink>

        <ProductItem v-else v-bind="p" placeholder>
          <template #placeholder>
            <p v-html="p.placeholderText"></p>
          </template>
        </ProductItem>
      </template>
    </div>
  </section>
</template>
