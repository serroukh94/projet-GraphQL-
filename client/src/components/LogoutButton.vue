<template>
  <button @click="logout" class="logout-button">Déconnecter</button>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/signup')
}
</script>

<style scoped>
.logout-button {
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style>
