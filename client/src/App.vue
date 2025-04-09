<template>
  <nav class="navbar">
    <div class="navbar-left">
      <span class="brand">Mon Réseau</span>
    </div>
    <div class="navbar-right">
      <template v-if="isAuthenticated">
        <!-- Si connecté, on affiche le bouton Logout -->
        <LogoutButton />
      </template>
      <template v-else>
        <!-- Si non connecté, on affiche les liens Login et Signup -->
        <router-link class="nav-link" to="/login">Login</router-link>
        <router-link class="nav-link" to="/signup">Signup</router-link>
      </template>
    </div>
  </nav>
  <!-- Affiche la page en fonction de la route -->
  <router-view />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import LogoutButton from './components/LogoutButton.vue'

export default defineComponent({
  components: { LogoutButton },
  setup() {
    const isAuthenticated = computed(() => {
      return !!localStorage.getItem('token')
    })
    return { isAuthenticated }
  }
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Dégradé de couleur pour un effet moderne */
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  padding: 1rem 2rem;
  color: #fff;
}

.navbar-left .brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
}

/* Liens de navigation */
.nav-link {
  margin-left: 1rem;
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #dfe6e9;
}
</style>
