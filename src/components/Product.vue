<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  id: { type: Number },
})

// лучше объект, потому что приходит один товар
const product = ref(null)
const isLoading = ref(false)
const error = ref(null)

// галерея
const selectedImage = ref('') // что показываем в большой картинке
const activeSlide = ref(0) // для моб. слайдера

// модалка
const isModalOpen = ref(false)

// форма (минимально)
const form = ref({
  name: '',
  email: '',
  phone: '',
  city: '',
  type_delivery: '1',
  pick_up_point: '',
  recipient: '',
  comment: '',
  type_pay: '1',
})

const images = computed(() => {
  if (!product.value) return []
  const main = product.value.mainImage ? [product.value.mainImage] : []
  const other = Array.isArray(product.value.otherImages) ? product.value.otherImages : []
  // если mainImage повторяется в otherImages — можно отфильтровать
  const all = [...main, ...other]
  return all.filter(Boolean)
})

const formattedPrice = computed(() => {
  const price = Number(product.value?.price ?? 0)
  return price.toLocaleString('ru-RU') + '₽'
})

const totalPrice = computed(() => formattedPrice.value)

function selectThumb(src) {
  selectedImage.value = src
  // синхронизируем моб. слайдер с выбранной картинкой
  const idx = images.value.indexOf(src)
  if (idx !== -1) activeSlide.value = idx
}

const isFavorite = computed(() => product.value?.isFavorite)

function setSlide(index) {
  activeSlide.value = index
  const src = images.value[index]
  if (src) selectedImage.value = src
}

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function removeProductFromModal() {
  // пока просто закрываем (или можешь сделать emit/событие в корзину)
  closeModal()
}

function submitOrder() {
  // тут вместо alert обычно отправляют axios.post(...)
  alert('Форма отправлена')
  closeModal()
}

function toggleFavorite() {
  if (!product.value) return

  product.value.isFavorite = !product.value.isFavorite

  // ⬇️ позже можно заменить на axios.post/patch
  // axios.patch(`/product/${product.value.id}`, {
  //   isFavorite: product.value.isFavorite
  // })
}

// блокировка скролла при открытой модалке
watch(isModalOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : 'auto'
})

onMounted(async () => {
  try {
    isLoading.value = true
    const { data } = await axios.get('https://1150afc2fccb82e5.mokky.dev/product?id=' + props.id)

    // мокки часто возвращает массив по фильтру id=
    const item = Array.isArray(data) ? data[0] : data
    product.value = item

    // выставим дефолтную картинку
    selectedImage.value = item?.mainImage || item?.otherImages?.[0] || ''
    activeSlide.value = 0
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось загрузить товар'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="product" v-if="product">
    <div class="product-gallery">
      <div class="left-column">
        <!-- Thumbnails -->
        <div class="thumbnails" id="thumbnails">
          <img
            v-for="(img, idx) in images"
            :key="img + idx"
            :src="img"
            :alt="`Thumbnail ${idx + 1}`"
            class="thumbnail"
            :class="{ selected: img === selectedImage }"
            @click="selectThumb(img)"
          />
        </div>

        <!-- Mobile slider -->
        <div class="mobile-slider" id="mobileSlider">
          <div class="mobile-slider-images">
            <img
              v-for="(img, idx) in images"
              :key="img + 'slide' + idx"
              :src="img"
              :alt="`Slide ${idx + 1}`"
              class="slide"
              :class="{ active: idx === activeSlide }"
            />
          </div>

          <div class="slider-dots" id="sliderDots">
            <span
              v-for="(_, idx) in images"
              :key="'dot' + idx"
              :class="{ active: idx === activeSlide }"
              @click="setSlide(idx)"
            />
          </div>
        </div>

        <!-- Main image -->
        <div class="main-image-wrapper">
          <img :src="selectedImage" alt="Main product" id="mainImage" class="main-image" />
        </div>
      </div>

      <div class="product-details">
        <div class="product-header">
          <h1 class="product-title">{{ product.title }}</h1>
          <div class="product-price">{{ formattedPrice }}</div>
        </div>

        <div class="product-article">Артикул: {{ product.article }}</div>

        <div class="product-info">
          <p class="product-description">
            {{ product.description }}
          </p>

          <div class="product-buttons">
            <button type="button" class="btn btn-primary" id="buy-button" @click="openModal">
              Купить
            </button>
            <button class="btn btn-outline" :class="{ active: isFavorite }" @click="toggleFavorite">
              {{ isFavorite ? 'В избранном' : 'В избранное' }}
            </button>
          </div>

          <div class="accordion">
            <details>
              <summary>Состав и уход</summary>
              <p>{{ product.care }}</p>
            </details>
            <details>
              <summary>Обмеры</summary>
              <p>{{ product.measurements }}</p>
            </details>
            <details>
              <summary>Параметры модели</summary>
              <p>{{ product.modelParams }}</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Состояния загрузки/ошибки -->
  <div v-else-if="isLoading">Загрузка...</div>
  <div v-else-if="error">{{ error }}</div>

  <!-- Overlay + modal -->
  <div
    v-if="product"
    id="overlay"
    v-show="isModalOpen"
    @click="closeModal"
    style="display: block"
  ></div>

  <div
    v-if="product"
    id="modal"
    class="modal-window"
    v-show="isModalOpen"
    style="display: block"
    @click.stop
  >
    <button class="close-button" id="close-button" @click="closeModal">&times;</button>

    <form action="#" @submit.prevent="submitOrder">
      <div class="modal-header">
        <span class="modal-header-first">Оформить</span><br />
        <span class="modal-header-second">заказ</span>
      </div>

      <div class="modal-products">
        <div class="modal-product">
          <img :src="product.mainImage || images[0]" />
          <div class="modal-product-info">
            <div class="modal-product-title">{{ product.title }}</div>
            <div class="modal-product-price">{{ formattedPrice }}</div>
          </div>
          <button
            class="close-button"
            id="modal-delete-product"
            type="button"
            @click="removeProductFromModal"
          >
            &times;
          </button>
        </div>
      </div>

      <div class="modal-contact-info">
        <div class="modal-field">
          <label for="name">ФИО</label>
          <input type="text" id="name" name="name" v-model="form.name" />
        </div>

        <div class="modal-field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" v-model="form.email" />
        </div>

        <div class="modal-field">
          <label for="phone">Телефон</label>
          <input type="text" id="phone" name="phone" v-model="form.phone" />
        </div>
      </div>

      <div class="modal-header">
        <span class="modal-header-first">Доставка</span>
      </div>

      <div class="modal-delivery-info">
        <div class="modal-field">
          <label for="city">Город</label>
          <input type="text" id="city" name="city" v-model="form.city" />
        </div>

        <div class="modal-field-list-check">
          <input
            type="radio"
            id="option1"
            name="type_delivery"
            value="1"
            v-model="form.type_delivery"
          />
          <label for="option1">Доставка СДЭК до пункта выдачи</label>
        </div>

        <div class="modal-field-list-check">
          <input
            type="radio"
            id="option2"
            name="type_delivery"
            value="2"
            v-model="form.type_delivery"
          />
          <label for="option2">Доставка Почтой России</label>
        </div>

        <div class="modal-field-list-check">
          <input
            type="radio"
            id="option3"
            name="type_delivery"
            value="3"
            v-model="form.type_delivery"
          />
          <label for="option3">Доставка заграницу</label>
        </div>

        <div class="modal-field">
          <label for="pick_up_point">Пункт получения</label>
          <input type="text" id="pick_up_point" name="pick_up_point" v-model="form.pick_up_point" />
        </div>

        <div class="modal-field">
          <label for="recipient">Получатель</label>
          <input type="text" id="recipient" name="recipient" v-model="form.recipient" />
        </div>

        <div class="modal-field">
          <label for="comment">Комментарий</label>
          <textarea
            id="comment"
            name="comment"
            rows="5"
            cols="33"
            v-model="form.comment"
          ></textarea>
        </div>

        <div class="modal-field-list-check">
          <input type="radio" id="type_pay1" name="type_pay" value="1" v-model="form.type_pay" />
          <label for="type_pay1">Картой</label>
        </div>

        <div class="modal-field-list-check">
          <input type="radio" id="type_pay2" name="type_pay" value="2" v-model="form.type_pay" />
          <label for="type_pay2">Долями</label>
        </div>

        <div class="modal-summury-sum">Итоговая сумма: {{ totalPrice }}</div>
      </div>

      <button class="btn btn-primary" type="submit">Купить</button>
    </form>
  </div>
</template>

<style scoped>
/* точки должны быть кликабельными */
.slider-dots span {
  cursor: pointer;
}

.btn-outline.active {
  border-color: #f04591;
  background: #f04591;
  color: #fff;
}
</style>
