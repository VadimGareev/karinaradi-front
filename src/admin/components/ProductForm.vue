<script setup>
import { reactive, watch, ref } from 'vue'

const props = defineProps({
  product: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
})
const emit = defineEmits(['save', 'cancel'])

const defaultProduct = () => ({
  id: null,
  title: '',
  price: 0,
  article: '',
  mainImage: '', // URL if exists
  otherImages: [], // array of URLs
  description: '',
  care: '',
  measurements: '',
  modelParams: '',
  isFavorite: false,
  category: [],
})

const form = reactive(defaultProduct())

// File inputs + previews
const mainImageFile = ref(null)
const mainImagePreview = ref('')
const otherImageFiles = ref([]) // array of File
const otherImagePreviews = ref([]) // array of preview URLs

watch(
  () => props.product,
  (p) => {
    if (p) {
      const copy = JSON.parse(JSON.stringify(p))
      // normalize category to array for multi-select compatibility
      if (copy.category && !Array.isArray(copy.category)) copy.category = [copy.category]
      if (!copy.category) copy.category = []
      Object.assign(form, copy)
      // reset file inputs
      mainImageFile.value = null
      mainImagePreview.value = p.mainImage || ''
      otherImageFiles.value = []
      otherImagePreviews.value = p.otherImages ? [...p.otherImages] : []
    } else {
      Object.assign(form, defaultProduct())
      mainImageFile.value = null
      mainImagePreview.value = ''
      otherImageFiles.value = []
      otherImagePreviews.value = []
    }
  },
  { immediate: true },
)

const onMainImageSelected = (e) => {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  mainImageFile.value = f
  mainImagePreview.value = URL.createObjectURL(f)
}

const onOtherImagesSelected = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach((f) => {
    otherImageFiles.value.push(f)
    otherImagePreviews.value.push(URL.createObjectURL(f))
  })
}

const removeOtherImage = (index) => {
  // if it's an uploaded preview (file)
  if (otherImageFiles.value[index]) {
    otherImageFiles.value.splice(index, 1)
  } else {
    // it's an existing URL from form.otherImages
    form.otherImages.splice(index, 1)
  }
  otherImagePreviews.value.splice(index, 1)
}

const submit = async () => {
  if (!form.title) {
    alert('Введите название товара')
    return
  }
  if (!form.id) form.id = Date.now()

  // Prepare product object without files (backend expects image URLs).
  const productToSave = JSON.parse(JSON.stringify(form))

  // Collect files that need to be uploaded by parent: mainImageFile + otherImageFiles
  const files = {}
  if (mainImageFile.value) files.mainImage = mainImageFile.value
  if (otherImageFiles.value.length) files.otherImages = [...otherImageFiles.value]

  // Emit product + files (parent should upload files, get URLs and then finalise save)
  emit('save', { product: productToSave, files })
  // do not reset previews here — parent decides
}

const cancel = () => emit('cancel')
</script>

<template>
  <div class="product-form card">
    <h3 class="title">{{ form.id ? 'Редактировать товар' : 'Добавить товар' }}</h3>

    <div class="row">
      <label>Название</label>
      <input v-model="form.title" placeholder="Название" />
    </div>

    <div class="row two-cols">
      <div>
        <label>Цена</label>
        <input type="number" v-model.number="form.price" />
      </div>
      <div>
        <label>Артикул</label>
        <input v-model="form.article" placeholder="UUID или код" />
      </div>
    </div>

    <div class="row">
      <label>Категория</label>
      <select v-model="form.category" multiple size="4">
        <option value="">-- выберите --</option>
        <option v-for="c in categories" :key="c.id" :value="c.slug || c.name">{{ c.name }}</option>
      </select>
    </div>

    <div class="row">
      <label>Главное изображение</label>
      <div class="file-row">
        <input type="file" accept="image/*" @change="onMainImageSelected" />
        <div v-if="mainImagePreview || form.mainImage" class="preview">
          <img :src="mainImagePreview || form.mainImage" alt="main" />
        </div>
      </div>
      <small class="hint"
        >Загрузите файл — после отправки форма передаст файл родительскому компоненту для загрузки
        на сервер. Если оставить пустым — будет использован существующий URL.</small
      >
    </div>

    <div class="row">
      <label>Другие изображения</label>
      <div class="file-row">
        <input type="file" accept="image/*" multiple @change="onOtherImagesSelected" />
        <div class="previews">
          <div class="preview-mini" v-for="(src, idx) in otherImagePreviews" :key="idx">
            <img :src="src" />
            <button type="button" class="remove" @click="removeOtherImage(idx)">×</button>
          </div>
          <!-- also show existing form.otherImages if any and not duplicated -->
          <div
            class="preview-mini"
            v-for="(src, idx2) in form.otherImages"
            :key="'old-' + idx2"
            v-if="!otherImagePreviews.includes(src)"
          >
            <img :src="src" />
            <button
              type="button"
              class="remove"
              @click="removeOtherImage(form.otherImages.indexOf(src))"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <label>Описание</label>
      <textarea v-model="form.description" rows="3" />
    </div>

    <div class="row two-cols">
      <div>
        <label>Уход (care)</label>
        <textarea v-model="form.care" rows="2" />
      </div>
      <div>
        <label>Измерения</label>
        <textarea v-model="form.measurements" rows="2" />
      </div>
    </div>

    <div class="row">
      <label>Параметры модели (modelParams)</label>
      <textarea v-model="form.modelParams" rows="2" />
    </div>

    <div class="row">
      <label class="inline"><input type="checkbox" v-model="form.isFavorite" /> В избранном</label>
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
.row input[type='text'],
.row input[type='number'],
.row select,
.row textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}
.two-cols {
  display: flex;
  gap: 12px;
}
.two-cols > div {
  flex: 1;
}
.file-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.preview img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
}
.previews {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.preview-mini {
  position: relative;
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #eee;
}
.preview-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.preview-mini .remove {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
}
.hint {
  color: #666;
  font-size: 12px;
  display: block;
  margin-top: 6px;
}
.inline {
  display: flex;
  align-items: center;
  gap: 8px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
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
