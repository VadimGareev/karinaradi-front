<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  category: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const defaultCategory = () => ({ id: null, name: '', slug: '', parents: [] })
const form = reactive(defaultCategory())

watch(
  () => props.category,
  (c) => {
    if (c) Object.assign(form, JSON.parse(JSON.stringify(c)))
    else Object.assign(form, defaultCategory())
  },
  { immediate: true },
)

watch(
  () => form.name,
  (val) => {
    if (!form.slug) form.slug = val ? val.toLowerCase().replace(/\s+/g, '-') : ''
  },
)

const submit = () => {
  if (!form.name) {
    alert('Введите название категории')
    return
  }
  if (!form.id) form.id = Date.now()
  emit('save', JSON.parse(JSON.stringify(form)))
}

const cancel = () => emit('cancel')
</script>

<template>
  <div class="card cat-form">
    <h3 class="title">{{ form.id ? 'Редактировать категорию' : 'Добавить категорию' }}</h3>

    <div class="row">
      <label>Название</label>
      <input v-model="form.name" />
    </div>

    <div class="row">
      <label>Slug</label>
      <input v-model="form.slug" />
    </div>

    <div class="row">
      <label>Родительские категории</label>
      <div class="parents">
        <label v-for="c in categories" :key="c.id" class="parent-item">
          <input type="checkbox" :value="c.id" v-model="form.parents" /> {{ c.name }}
        </label>
      </div>
    </div>

    <div class="actions">
      <button class="btn primary" @click="submit">{{ form.id ? 'Сохранить' : 'Добавить' }}</button>
      <button class="btn" @click="cancel" type="button">Отмена</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(10, 10, 10, 0.06);
}
.title {
  margin: 0 0 12px 0;
  font-size: 18px;
}
.row {
  margin-bottom: 12px;
}
.row label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}
.row input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}
.parents {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.parent-item {
  background: #f5f5f5;
  padding: 6px 8px;
  border-radius: 6px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f7f7f7;
  cursor: pointer;
}
.btn.primary {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
</style>
