<template>
    <button @click="logout" class="logout-button">Déconnecter</button>
  </template>
  
  <script lang="ts" setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  function logout() {
    // Supprime le token stocké dans le localStorage
    localStorage.removeItem('token')
    // Redirige l'utilisateur vers la page d'inscription (ou Login selon ta préférence)
    router.push('/signup')
  }
  </script>
  
  <style scoped>
  .logout-button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    background-color: #f44336;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .logout-button:hover {
    background-color: #d32f2f;
  }
  </style>
  