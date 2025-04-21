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

      <button type="submit" class="submit-button">Valider</button>
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
        const result = await signup({
          email: email.value,
          password: password.value,
          name: name.value || null,
        })
        const data = result?.data
        if (!data || !data.signup) {
          throw new Error("Le token n'a pas été généré.")
        }
        localStorage.setItem('token', data.signup)
        router.push('/login')
      } catch (err: any) {
        error.value = err.message || "Erreur lors de l'inscription."
      }
    }

    return { email, password, name, error, signupHandler }
  }
})
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.auth-container h1 {
  margin-bottom: 1rem; 
  text-align: center;
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
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #1976d2;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
}
</style>
