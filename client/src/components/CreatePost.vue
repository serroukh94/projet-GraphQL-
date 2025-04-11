<!-- src/components/CreatePost.vue -->
<template>
    <div>
      <h2>Créer un nouvel article</h2>
      <form @submit.prevent="onSubmit">
        <div>
          <label for="title">Titre :</label>
          <input id="title" v-model="title" />
        </div>
        <div>
          <label for="content">Contenu :</label>
          <textarea id="content" v-model="content"></textarea>
        </div>
        <button type="submit">Publier</button>
      </form>
      <p v-if="errorMsg" style="color:red;">{{ errorMsg }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useMutation } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  
  const CREATE_PUBLICATION = gql`
    mutation CreatePublication($data: CreatePublicationInput!) {
      createPublication(data: $data) {
        id
        title
        content
        createdAt
        author {
          id
          name
        }
      }
    }
  `
  
  const title = ref('')
  const content = ref('')
  const errorMsg = ref('')
  
  const { mutate: createPublication, onDone, onError } = useMutation(CREATE_PUBLICATION)

  onError((error) => {
    errorMsg.value = error.message
  })

  onDone(() => {
    title.value = ''
    content.value = ''
    // Optionnel : rediriger ou rafraîchir la liste des posts
  })
  
  function onSubmit() {
    if (!content.value) {
      errorMsg.value = 'Le contenu est obligatoire !'
      return
    }
    createPublication({
      data: {
        title: title.value || 'Publication',
        text: content.value,
      },
    })
  }
  </script>
  