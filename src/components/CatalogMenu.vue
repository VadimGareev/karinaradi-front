<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const categories = ref([])

const loadCategories = async () => {
  const response = {
    data: {
      categories: [
        { id: 2, name: 'Платья', slug: 'dresses', parents: [] },
        { id: 3, name: 'Костюмы', slug: 'suits', parents: [] },
        { id: 4, name: 'Блузы и рубашки', slug: 'blouses', parents: [3] },
        { id: 5, name: 'Вечерние платья', slug: 'evening-dresses', parents: [2] },
        { id: 6, name: 'Летние платья', slug: 'summer-dresses', parents: [2] },
        { id: 7, name: 'Распродажа', slug: 'sale', parents: [3, 2] },
      ],
    },
  }
  // const response = await axios.get('/api/categories')
  categories.value = response.data.categories
}

onMounted(loadCategories)

const currentCategory = computed(() => {
  const slug = route.params.slug
  if (!slug) return null
  return categories.value.find((c) => c.slug === slug) ?? null
})

const rootCategories = computed(() =>
  categories.value.filter((c) => !c.parents || c.parents.length === 0),
)

const parentCategory = computed(() => {
  if (!currentCategory.value?.parents?.length) return null
  return categories.value.find((c) => c.id === currentCategory.value.parents[0]) ?? null
})

const childCategories = computed(() => {
  if (!currentCategory.value) return []
  return categories.value.filter((cat) => cat.parents?.includes(currentCategory.value.id))
})

const siblingCategories = computed(() => {
  if (!parentCategory.value) return []
  return categories.value.filter((cat) => cat.parents?.includes(parentCategory.value.id))
})

// Вспомогательная функция: формирует объект маршрута
const makeRoute = (slug) => {
  // если slug пустой/null/undefined — ведём на корень каталога (/catalog)
  if (!slug) return { name: 'catalog' }
  return { name: 'catalog', params: { slug } }
}

const menuItems = computed(() => {
  // нет выбранной категории -> показываем верхний уровень (root)
  if (!currentCategory.value) {
    return rootCategories.value.map((c) => ({
      id: c.id,
      name: c.name,
      to: makeRoute(c.slug),
    }))
  }

  // если у текущей есть родитель — мы внутри дочери -> показываем "Все" (на родителя) + все дочери родителя (siblings)
  if (parentCategory.value) {
    const all = {
      id: `${parentCategory.value.id}-all`,
      name: 'Все',
      to: makeRoute(parentCategory.value.slug), // это ведёт на /catalog/:parentSlug
    }
    const siblings = siblingCategories.value.map((c) => ({
      id: c.id,
      name: c.name,
      to: makeRoute(c.slug),
    }))
    return [all, ...siblings]
  }

  // иначе текущая — родительская категория: показываем "Все" (на корень каталога) + её дети
  // Тут важное изменение: если текущая категория — верхний уровень (parents пустые),
  // то "Все" должен вести на /catalog (корень), а не на /catalog/:currentSlug
  const allSelf = {
    id: `${currentCategory.value.id}-all`,
    name: 'Все',
    // если текущая категория — top-level (нет родителей), "Все" -> корень каталога
    to:
      currentCategory.value &&
      (!currentCategory.value.parents || currentCategory.value.parents.length === 0)
        ? makeRoute(undefined) // -> { name: 'catalog' } => '/catalog'
        : makeRoute(currentCategory.value.slug),
  }

  const children = childCategories.value.map((c) => ({
    id: c.id,
    name: c.name,
    to: makeRoute(c.slug),
  }))

  return [allSelf, ...children]
})
</script>

<template>
  <section class="catalog-header" v-if="categories.length">
    <div class="catalog-bread-crumbs"></div>

    <div class="category-title">
      <h1>{{ currentCategory ? currentCategory.name : 'Каталог' }}</h1>
    </div>

    <div class="category-daughters" v-if="menuItems.length">
      <ul>
        <li v-for="item in menuItems" :key="item.id">
          <!-- используем готовый объект route в item.to -->
          <RouterLink :to="item.to">
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped></style>
