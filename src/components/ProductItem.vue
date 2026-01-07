<!-- components/ProductItem.vue -->
<template>
  <div :class="wrapperClass">
    <!-- placeholder mode: либо через проп, либо через слот named "placeholder" -->
    <template v-if="placeholder">
      <div :class="placeholderClass">
        <slot name="placeholder">
          <!-- fallback content если слот не передан -->
          <p v-html="placeholderText"></p>
        </slot>
      </div>
    </template>

    <!-- обычный товар -->
    <template v-else>
      <a :href="href" class="zoom-on-hover" @click="$emit('click', item)">
        <img :src="image" :alt="title" :style="imageStyle" />

        <div
          class="favorite"
          :class="{ 'is-favorite': isFavorite }"
          @click.stop.prevent="toggleFavorite"
        >
          <div class="favorite-icon"></div>
        </div>

        <div class="product-title">
          <h3>{{ title }}</h3>
          <div class="price">{{ price }}</div>
        </div>
        <div class="product-info">{{ info }}</div>
      </a>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // товарные данные
  id: { type: Number, default: 0 },
  image: { type: String, default: '/img/product-main.jpg' },
  title: { type: String, default: '' },
  price: { type: [String, Number], default: '' },
  info: { type: String, default: '' },
  href: { type: String, default: '#' },
  isFavorite: { type: Boolean, default: false },
  // placeholder mode
  placeholder: { type: Boolean, default: false },
  placeholderType: { type: String, default: 'pink' }, // 'pink' (=> .placeholder) или 'black' (=> .placeholder-black)
  placeholderText: { type: String, default: 'Placeholder' },
  // вариант расположения: 'first' | 'second-left' | 'second-right'
  variant: { type: String, default: 'first' },
  // опционально передать высоту изображения (например для большого блока 920px)
  imgHeight: { type: [Number, String], default: null },
  // целиком объект товара (удобно при emit'ах)
  item: { type: Object, default: null },
})

const emit = defineEmits(['toggle-favorite', 'click'])

const wrapperClass = computed(() => {
  if (props.variant === 'second-left') return 'product-item-second-left'
  if (props.variant === 'second-right') return 'product-item-second-right'
  return 'product-item'
})

const placeholderClass = computed(() =>
  props.placeholderType === 'black' ? 'placeholder-black' : 'placeholder',
)

const imageStyle = computed(() => {
  if (!props.imgHeight) return {}
  const h = typeof props.imgHeight === 'number' ? props.imgHeight + 'px' : props.imgHeight
  return { height: h, objectFit: 'cover', width: '100%' }
})

function toggleFavorite() {
  emit('toggle-favorite', props.item ?? { id: props.id })
}
</script>
