<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
const closeMenu = () => {
  isOpen.value = false
  buyersOpen.value = false
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) closeMenu()
}

const buyersOpen = ref(false)

const toggleBuyers = () => {
  buyersOpen.value = !buyersOpen.value
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="header">
    <RouterLink to="/"
      ><div class="logo"><img src="/img/logo.png" alt="KarinaRadi" /></div
    ></RouterLink>

    <div id="overlay" :class="{ show: isOpen }" @click="closeMenu" />

    <nav :class="['nav', { 'mobile-open': isOpen }]">
      <div class="nav-item">
        <RouterLink to="/" @click="closeMenu">Главная</RouterLink>
      </div>
      <div class="nav-item">
        <RouterLink to="/catalog" @click="closeMenu">Каталог</RouterLink>
      </div>
      <div class="nav-item">
        <button
          style="cursor: pointer; text-transform: uppercase"
          class="buyers-toggle"
          @click="toggleBuyers"
          type="button"
        >
          Покупателям
          <span class="arrow" :class="{ open: buyersOpen }"></span>
        </button>
        <ul class="dropdown" :class="{ open: buyersOpen }" v-auto-animate>
          <li>
            <RouterLink to="/refunds" @click="closeMenu">Условия обмена и возврата</RouterLink>
          </li>
          <li>
            <RouterLink to="/delivery" @click="closeMenu">Доставка</RouterLink>
          </li>
          <li>
            <RouterLink to="/about" @click="closeMenu">О нас</RouterLink>
          </li>
          <li>
            <RouterLink to="/offer" @click="closeMenu">Оферта</RouterLink>
          </li>
        </ul>
      </div>
    </nav>
    <div class="actions">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 50 50"
        fill="currentColor"
      >
        <path
          d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"
        ></path>
      </svg>
      <RouterLink to="/favorites">
        <div class="favorite-icon">
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            enable-background="new 0 0 34 31"
            viewBox="0 0 34 31"
          >
            <g>
              <path
                d="m16.8 30c-.4 0-.7-.1-1-.4-.4-.4-9.9-8.8-13.2-13.2-2-2.6-2.6-6-1.8-9 .8-2.9 2.8-5.1 5.6-6.2 4.6-1.8 8.2.2 10.4 3 2.2-2.5 6.4-5 11.3-3 2.5 1 4.3 2.9 5 5.4.9 3.1 0 6.9-2.2 9.8-3.3 4.4-12.8 12.8-13.2 13.2-.2.3-.5.4-.9.4zm-6.9-26.5c-.7 0-1.4.1-2.3.5-1.9.8-3.3 2.3-3.8 4.2-.6 2.2-.1 4.6 1.3 6.4 2.5 3.4 9.2 9.6 11.8 11.9 2.5-2.3 9.3-8.5 11.8-11.9 1.6-2.2 2.3-5 1.7-7.2-.5-1.6-1.5-2.8-3.2-3.5-4.5-1.8-8.1 2-8.9 3.6-.3.5-.8.8-1.3.8-.6 0-1.1-.3-1.3-.8-.8-1-2.6-4-5.8-4z"
              />
            </g>
          </svg>
          <span class="counter">3</span>
        </div>
      </RouterLink>
    </div>
    <button
      class="burger"
      @click="toggleMenu"
      :aria-expanded="isOpen"
      aria-label="Меню"
      type="button"
    >
      ☰
    </button>
  </header>
</template>

<style scoped>
:deep(.nav .router-link-exact-active) {
  font-weight: 600;
  border-bottom: 2px solid #f04591;
}
</style>
