<template>
  <nav>
    <!-- Liens de navigation vers les routes -->
    <router-link to="/home">Home</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/signup">Signup</router-link>
  </nav>

  <!-- router-view est l'endroit où s'affiche le composant lié à la route -->
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped>
nav {
  background-color: #eee;
  padding: 1rem;
}
nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}
</style>
