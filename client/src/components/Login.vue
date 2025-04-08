<!-- client/src/components/Login.vue -->
<template>
    <div class="auth-container">
      <h1>Se connecter</h1>
      <form @submit.prevent="loginHandler" class="auth-form">
        <label>Email</label>
        <input v-model="email" type="email" />
  
        <label>Password</label>
        <input v-model="password" type="password" />
  
        <button type="submit">Se connecter</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useMutation } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  import { useRouter } from 'vue-router'
  
  const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `
  
  export default defineComponent({
    setup() {
      const email = ref('')
      const password = ref('')
      const error = ref('')
  
      const router = useRouter()
      const { mutate: login } = useMutation(LOGIN_MUTATION)
  
      const loginHandler = async () => {
        try {
          error.value = ''
          const res = await login({
            variables: {
              email: email.value,
              password: password.value
            }
          })
          // On récupère le token
          const token = res.data?.login
          // On stocke
          localStorage.setItem('token', token)
          // Redirection vers Home
          router.push('/home')
        } catch (err: any) {
          error.value = err.message
        }
      }
  
      return { email, password, error, loginHandler }
    }
  })
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 400px;
    margin: 2rem auto;
  }
  .auth-form {
    display: flex;
    flex-direction: column;
  }
  .error {
    color: red;
    margin-top: 1rem;
  }
  </style>
  