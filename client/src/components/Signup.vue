<!-- client/src/components/Signup.vue -->
<template>
    <div class="auth-container">
      <h1>S'inscrire</h1>
      <form @submit.prevent="signupHandler" class="auth-form">
        <label>Email</label>
        <input v-model="email" type="email" />
  
        <label>Password</label>
        <input v-model="password" type="password" />
  
        <label>Name (optionnel)</label>
        <input v-model="name" type="text" />
  
        <button type="submit">Valider</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useMutation } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  import { useRouter } from 'vue-router'
  
  const SIGNUP_MUTATION = gql`
    mutation Signup($email: String!, $password: String!, $name: String) {
      signup(email: $email, password: $password, name: $name)
    }
  `
  
  export default defineComponent({
    setup() {
      const email = ref('')
      const password = ref('')
      const name = ref('')
      const error = ref('')
  
      const router = useRouter()
  
      const { mutate: signup } = useMutation(SIGNUP_MUTATION)
  
      const signupHandler = async () => {
        try {
          error.value = ''
          const res = await signup({
            variables: {
              email: email.value,
              password: password.value,
              name: name.value || null
            }
          })
          // On récupère le token renvoyé par "signup"
          const token = res.data?.signup
          // On stocke le token (localStorage, par exemple)
          localStorage.setItem('token', token)
          // Redirection vers la page Home
          router.push('/home')
        } catch (err: any) {
          error.value = err.message
        }
      }
  
      return {
        email,
        password,
        name,
        error,
        signupHandler
      }
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
  .auth-form label {
    margin-top: 1rem;
  }
  .error {
    color: red;
    margin-top: 1rem;
  }
  </style>
  