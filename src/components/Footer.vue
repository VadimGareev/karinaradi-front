<script setup>
import { ref, nextTick, onMounted } from 'vue'

const isOpen = ref([false, false, false]) // 3 секции
const contents = ref([])

// helper: сохраняем DOM-элемент в массив contents
const setContentRef = (el, idx) => {
  if (el) {
    contents.value[idx] = el
  } else {
    // при размонтировании элемента очищаем ссылку
    contents.value[idx] = null
  }
}

const toggle = async (idx) => {
  // переключаем состояние
  isOpen.value[idx] = !isOpen.value[idx]

  // ждём рендера
  await nextTick()

  const el = contents.value[idx]
  if (!el) return

  if (isOpen.value[idx]) {
    // открываем — явно устанавливаем maxHeight равным фактической высоте
    el.style.maxHeight = el.scrollHeight + 'px'
  } else {
    // закрываем: сначала зафиксируем текущую высоту, затем сбросим
    el.style.maxHeight = el.scrollHeight + 'px'
    // форсируем reflow
    void el.offsetHeight
    el.style.maxHeight = null
  }
}

// на случай изменения размеров — можно сбросить maxHeight, чтобы при изменении контента корректно пересчитывалось при следующем открытии
onMounted(() => {
  contents.value.forEach((el) => {
    if (el) el.style.maxHeight = null
  })
})
</script>

<template>
  <footer class="footer">
    <div class="footer-menu">
      <div class="footer-section">
        <h4
          class="accordion-header"
          @click="toggle(0)"
          :class="{ active: isOpen[0] }"
          :aria-expanded="isOpen[0]"
        >
          Каталог
        </h4>
        <div
          class="accordion-content"
          :class="{ open: isOpen[0] }"
          :ref="(el) => setContentRef(el, 0)"
        >
          <ul>
            <li><RouterLink to="/catalog">Весь каталог</RouterLink></li>
            <li><RouterLink to="/catalog/dresses">Платья</RouterLink></li>
            <li><RouterLink to="/catalog/suits">Костюмы</RouterLink></li>
          </ul>
        </div>
      </div>

      <div class="footer-section">
        <h4
          class="accordion-header"
          @click="toggle(1)"
          :class="{ active: isOpen[1] }"
          :aria-expanded="isOpen[1]"
        >
          Покупателям
        </h4>
        <div
          class="accordion-content"
          :class="{ open: isOpen[1] }"
          :ref="(el) => setContentRef(el, 1)"
        >
          <ul>
            <li><RouterLink to="/refunds">Условия обмена и возврата</RouterLink></li>
            <li><RouterLink to="/delivery">Доставка</RouterLink></li>
            <li><RouterLink to="/about">О нас</RouterLink></li>
          </ul>
        </div>
      </div>

      <div class="footer-section newsletter">
        <h4
          class="accordion-header"
          @click="toggle(2)"
          :class="{ active: isOpen[2] }"
          :aria-expanded="isOpen[2]"
        >
          Прочее
        </h4>
        <div
          class="accordion-content"
          :class="{ open: isOpen[2] }"
          :ref="(el) => setContentRef(el, 2)"
        >
          <ul>
            <li><RouterLink to="/offer">Публичная оферта</RouterLink></li>
          </ul>
        </div>

        <div class="newsletter-header">
          <h4>Подписаться на рассылку</h4>
        </div>
        <div class="newsletter-form">
          <input id="email" type="email" placeholder="Введите ваш email" />
          <button>Отправить</button>
        </div>
        <div class="newsletter-consent">
          Нажимая кнопку «Отправить», вы даёте согласие на рекламную рассылку и обработку
          персональных данных в соответствии с правилами.
        </div>

        <div class="socials">
          <!-- svg ссылки ... -->
        </div>
      </div>
    </div>

    <div class="footer-logo-desktop">Karinaradi</div>
    <div class="footer-logo-mobile">KR</div>
  </footer>
</template>
