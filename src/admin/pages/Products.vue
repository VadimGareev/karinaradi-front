<script setup>
import { ref } from 'vue'
import ProductForm from '../components/ProductForm.vue'
import CategoryForm from '../components/CategoryForm.vue'

const categories = ref([
  { id: 2, name: 'Платья', slug: 'dresses', parents: [] },
  { id: 3, name: 'Костюмы', slug: 'suits', parents: [] },
  { id: 7, name: 'Распродажа', slug: 'sale', parents: [3, 2] },
])

const products = ref([
  {
    id: 2,
    title: 'Невероятный Пластиковый Ножницы',
    price: 15000,
    article: '91568b6b-31b8-4281-beff-bbb5b57f5b29',
    mainImage: '/img/product-main.jpg',
    otherImages: ['/img/product1.jpg', '/img/product1.jpg'],
    description: 'проблем нас',
    care: 'позиции',
    measurements: 'модернизации информационно-пропогандистское',
    modelParams: 'новых и существующий',
    isFavorite: true,
    category: ['suits'],
  },
])

const editingProduct = ref(null)
const showForm = ref(false)

const onAddClick = () => {
  editingProduct.value = null
  showForm.value = true
}

const onEdit = (p) => {
  const copy = JSON.parse(JSON.stringify(p))
  if (copy.category && !Array.isArray(copy.category)) copy.category = [copy.category]
  if (!copy.category) copy.category = []
  editingProduct.value = copy
  showForm.value = true
}

// Mock upload function — in production replace with API call that returns URL
const mockUpload = (file) => {
  return new Promise((res) => {
    // create temporary object URL to simulate returned link from backend
    const url = URL.createObjectURL(file)
    // small timeout to simulate network
    setTimeout(() => res(url), 300)
  })
}

const onSave = async (payload) => {
  // payload: { product, files }
  const prod = payload.product
  // handle main image upload
  if (payload.files && payload.files.mainImage) {
    const uploaded = await mockUpload(payload.files.mainImage)
    prod.mainImage = uploaded
  }
  // handle other images
  if (payload.files && payload.files.otherImages && payload.files.otherImages.length) {
    const arr = []
    for (const f of payload.files.otherImages) {
      const u = await mockUpload(f)
      arr.push(u)
    }
    // merge existing urls and newly uploaded
    prod.otherImages = (prod.otherImages || []).concat(arr)
  }

  const idx = products.value.findIndex((x) => x.id === prod.id)
  if (idx === -1) {
    products.value.push(prod)
  } else {
    products.value.splice(idx, 1, prod)
  }
  showForm.value = false
}

const onCancel = () => {
  showForm.value = false
  editingProduct.value = null
}

const remove = (p) => {
  if (confirm('Удалить товар "' + p.title + '"?')) {
    const idx = products.value.findIndex((x) => x.id === p.id)
    if (idx !== -1) products.value.splice(idx, 1)
  }
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>Товары</h1>
      <div>
        <button class="btn primary" @click="onAddClick">Добавить товар</button>
      </div>
    </header>

    <div v-if="showForm" class="form-wrap">
      <ProductForm
        :product="editingProduct"
        :categories="categories"
        @save="onSave"
        @cancel="onCancel"
      />
    </div>

    <div class="table-wrap">
      <table class="nice-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Фото</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Артикул</th>
            <th>Избранное</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>{{ p.id }}</td>
            <td class="td-img">
              <img v-if="p.mainImage" :src="p.mainImage" />
            </td>
            <td>{{ p.title }}</td>
            <td>
              {{
                (Array.isArray(p.category) ? p.category : [p.category])
                  .map(
                    (cat) =>
                      (
                        categories.find((c) => c.slug === cat) ||
                        categories.find((c) => c.id === cat) || { name: cat }
                      ).name,
                  )
                  .join(', ')
              }}
            </td>
            <td>{{ p.price }}</td>
            <td>{{ p.article }}</td>
            <td>{{ p.isFavorite ? 'Да' : 'Нет' }}</td>
            <td class="actions">
              <button class="btn" @click="onEdit(p)">Ред.</button>
              <button class="btn" @click="remove(p)">Удл.</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  background: #f6f8fb;
  min-height: 100vh;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.form-wrap {
  margin-bottom: 16px;
}
.nice-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(10, 10, 10, 0.04);
}
.nice-table th {
  text-align: left;
  padding: 12px;
  background: #f3f6fb;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}
.nice-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f3f6;
  vertical-align: middle;
}
.td-img img {
  width: 80px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
}
.actions {
  display: flex;
  gap: 6px;
}
.btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}
.btn.primary {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
</style>
