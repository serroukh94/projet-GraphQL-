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
  mutation Login($email: String!, $password: String!,$getToken: Boolean) {
    login(email: $email, password: $password,getToken: $getToken)
  }
`

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    // On récupère la fonction mutate et on la renomme "login"
    const { mutate: login } = useMutation(LOGIN_MUTATION)

    const loginHandler = async () => {
      try {
        error.value = ''
        // Ici on passe directement les champs sans les envelopper dans "variables"
        const { data } = await login({
          email: email.value,
          password: password.value,
          getToken: true
        })
        // On récupère le token de la réponse
        const token = data?.login
        if (!token) {
          throw new Error('Login failed: No token received')
        }
        // On stocke le token dans le localStorage
        localStorage.setItem('token', token)
        // Redirection vers la page Home
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
