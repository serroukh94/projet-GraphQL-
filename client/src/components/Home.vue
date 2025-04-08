<!-- Chemin : client/src/components/Home.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

/**
 * Query GraphQL : Récupération des articles avec filtres
 *  - authorId: ID (pour filtrer par auteur)
 *  - sortByLikes: Boolean (pour trier par nombre de likes)
 * Adapte cette query à ton schéma exact (noms de champs, etc.).
 */
const GET_ARTICLES = gql`
  query Articles($authorId: ID, $sortByLikes: Boolean) {
    articles(filter: { authorId: $authorId, sortByLikes: $sortByLikes }) {
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
const authorId = ref<string | null>(null);
const sortByLikes = ref(false);

// Exécution de la query
const { result, loading, error, refetch } = useQuery(GET_ARTICLES, () => ({
  authorId: authorId.value,
  sortByLikes: sortByLikes.value,
}));

// Fonction pour mettre à jour les filtres
function updateFilter(newAuthorId: string | null, newSortByLikes: boolean) {
  authorId.value = newAuthorId;
  sortByLikes.value = newSortByLikes;
  // "refetch" recharge la query avec les nouvelles variables
  refetch();
}
</script>

<template>
  <div>
    <h1>Articles Récents</h1>

    <!-- Formulaire de filtres -->
    <div class="filters">
      <!-- Filtrage par ID d'auteur -->
      <label>
        Auteur (ID) :
        <input
          type="text"
          @input="updateFilter($event.target.value ? $event.target.value : null, sortByLikes)"
          placeholder="Entrez un ID d'auteur"
        />
      </label>

      <!-- Tri par popularité -->
      <label>
        Trier par nombre de likes :
        <input type="checkbox" @change="updateFilter(authorId, $event.target.checked)" />
      </label>
    </div>

    <!-- Messages de chargement et d'erreur -->
    <div v-if="loading">Chargement des articles...</div>
    <div v-else-if="error">Erreur : {{ error.message }}</div>

    <!-- Liste des articles -->
    <div v-else>
      <div
        v-for="article in result.articles"
        :key="article.id"
        class="article"
      >
        <h2>{{ article.title }}</h2>
        <p>{{ article.content }}</p>
        <p><small>Auteur : {{ article.author.name }} | Likes : {{ article.likesCount }}</small></p>
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
