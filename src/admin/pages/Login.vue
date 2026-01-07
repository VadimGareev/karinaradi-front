<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')

const submit = async () => {
  // имитация ответа Symfony
  const fakeToken = 'jwt.token.example'
  auth.login(fakeToken)
  window.location.href = '/admin'
}
</script>

<template>
  <div class="login">
    <h1>Админка</h1>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Пароль" />
    <button @click="submit">Войти</button>
  </div>
</template>
