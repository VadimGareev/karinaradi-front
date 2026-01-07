<script setup>
import { ref } from 'vue'
import CategoryForm from '../components/CategoryForm.vue'

const categories = ref([
  { id: 2, name: 'Платья', slug: 'dresses', parents: [] },
  { id: 3, name: 'Костюмы', slug: 'suits', parents: [] },
  { id: 7, name: 'Распродажа', slug: 'sale', parents: [3, 2] },
])

const editing = ref(null)
const showForm = ref(false)

const addClick = () => {
  editing.value = null
  showForm.value = true
}

const edit = (c) => {
  editing.value = JSON.parse(JSON.stringify(c))
  showForm.value = true
}

const save = (c) => {
  const idx = categories.value.findIndex((x) => x.id === c.id)
  if (idx === -1) categories.value.push(c)
  else categories.value.splice(idx, 1, c)
  showForm.value = false
}

const cancel = () => {
  showForm.value = false
  editing.value = null
}

const removeCat = (c) => {
  if (confirm('Удалить категорию "' + c.name + '"?')) {
    const idx = categories.value.findIndex((x) => x.id === c.id)
    if (idx !== -1) categories.value.splice(idx, 1)
  }
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>Категории</h1>
      <div><button class="btn primary" @click="addClick">Добавить категорию</button></div>
    </header>

    <div v-if="showForm" class="form-wrap">
      <CategoryForm :categories="categories" :category="editing" @save="save" @cancel="cancel" />
    </div>

    <div class="table-wrap">
      <table class="nice-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Slug</th>
            <th>Родители</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.slug }}</td>
            <td>
              <span v-for="pid in c.parents" :key="pid" class="parent-pill">
                {{ (categories.find((x) => x.id === pid) || { name: pid }).name }}
              </span>
            </td>
            <td class="actions">
              <button class="btn" @click="edit(c)">Ред.</button>
              <button class="btn" @click="removeCat(c)">Удл.</button>
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
.parent-pill {
  display: inline-block;
  background: #eef2ff;
  padding: 6px 8px;
  border-radius: 999px;
  margin-right: 6px;
  font-size: 13px;
  color: #333;
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
