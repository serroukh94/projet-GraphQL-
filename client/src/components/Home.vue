<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_POSTS = gql`
  query GetPosts($authorId: Int, $sortByLikes: Boolean) {
    posts(authorId: $authorId, sortByLikes: $sortByLikes) {
      id
      title
      content
      createdAt
      likesCount
      author {
        id
        name
      }
    }
  }
`;

// Variables de filtre
const authorId = ref<number | null>(null);
const sortByLikes = ref(false);

// Exécution de la query
const { result, loading, error, refetch } = useQuery(GET_POSTS, () => ({
  authorId: authorId.value,
  sortByLikes: sortByLikes.value,
}));

// Fonction pour mettre à jour les filtres
function updateFilter(newAuthorId: number | null, newSortByLikes: boolean) {
  authorId.value = newAuthorId;
  sortByLikes.value = newSortByLikes;
  refetch();
}
</script>

<template>
  <div>
    <h1>Articles Récents</h1>

    <!-- Formulaire de filtres -->
    <div class="filters">
      <label>
        Auteur (ID) :
        <input
          type="text"
          @input="(e) => updateFilter(parseInt((e.target as HTMLInputElement).value) || null, sortByLikes)"
          placeholder="Entrez un ID d'auteur"
        />
      </label>

      <label>
        Trier par nombre de likes :
        <input
          type="checkbox"
          @change="(e) => updateFilter(authorId, (e.target as HTMLInputElement).checked)"
        />
      </label>
    </div>

    <div v-if="loading">Chargement des posts...</div>
    <div v-else-if="error">Erreur : {{ error.message }}</div>
    <div v-else>
      <div v-for="post in result.posts" :key="post.id" class="article">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
        <p>
          <small>
            Auteur : {{ post.author.name }} | Likes : {{ post.likesCount }}
          </small>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: 1rem;
}
.article {
  margin-bottom: 1rem;
}
</style>
