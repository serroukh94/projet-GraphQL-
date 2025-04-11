<template>
  <div class="auth-container">
    <h1>Se connecter</h1>
    <form @submit.prevent="loginHandler" class="auth-form">
      <label>Email</label>
      <input v-model="email" type="email" placeholder="Votre email" />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Votre mot de passe" />

      <button type="submit" class="submit-button">Se connecter</button>
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
  mutation Login($email: String!, $password: String!, $getToken: Boolean) {
    login(email: $email, password: $password, getToken: $getToken)
  }
`

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    // Récupère la mutation et la renomme "login"
    const { mutate: login } = useMutation(LOGIN_MUTATION)

    const loginHandler = async () => {
      try {
        error.value = ''
        const result = await login({
          email: email.value,
          password: password.value,
          getToken: true // Toujours récupérer le token
        })
        if (!result || !result.data) {
          throw new Error('Login failed: No data received')
        }
        const { data } = result
        const token = data?.login
        if (!token) {
          throw new Error('Login failed: No token received')
        }
        localStorage.setItem('token', token)
        router.push('/home')
      } catch (err: any) {
        error.value = err.message || 'Erreur lors de la connexion'
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
  background-color: #f9f9f9; /* Fond clair */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.auth-container h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.auth-form label {
  margin-top: 1rem;
  font-weight: 600;
}

.auth-form input {
  margin-top: 0.3rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #1976d2;
}

.error {
  margin-top: 1rem;
  text-align: center;
  color: red;
  font-weight: 600;
}
</style>
