<script setup lang="ts">
import { ref } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

// Déclaration des refs pour les filtres et la pagination
const authorId = ref<number | null>(null);
const sortByLikes = ref(false);
const page = ref(1);

// Query pour récupérer les publications avec pagination
const GET_PUBLICATIONS = gql`
  query GetPublications($page: Int) {
    getPublications(page: $page) {
      totalItems
      totalPages
      currentPage
      itemsPerPage
      publications {
        id
        title
        content
        createdAt
        likesCount
        isLiked
        author {
          id
          name
        }
      }
    }
  }
`;

// Mutation pour liker une publication
const LIKE_PUBLICATION = gql`
  mutation LikePublication($postId: Int!) {
    likePublication(postId: $postId) {
      id
      likesCount
    }
  }
`;

// Mutation pour déliker une publication
const UNLIKE_PUBLICATION = gql`
  mutation UnlikePublication($postId: Int!) {
    unlikePublication(postId: $postId) {
      id
      likesCount
    }
  }
`;

// Exécution de la query getPublications en utilisant la valeur de page
const { result, loading, error, refetch } = useQuery(GET_PUBLICATIONS, () => ({
  page: page.value,
}));

// Mutations pour like et unlike
const { mutate: likePublicationMutate } = useMutation(LIKE_PUBLICATION);
const { mutate: unlikePublicationMutate } = useMutation(UNLIKE_PUBLICATION);

// Tableau réactif pour stocker les IDs des publications que l'utilisateur a likées
const likedPosts = ref<number[]>([]);

// Fonction pour mettre à jour les filtres et rafraîchir la query
function updateFilter(newAuthorId: number | null, newSortByLikes: boolean) {
  authorId.value = newAuthorId;
  sortByLikes.value = newSortByLikes;
  refetch();
}

// Fonction pour changer de page (pour la pagination)
function changePage(newPage: number) {
  if (newPage > 0) {
    page.value = newPage;
    refetch();
  }
}

// Fonction pour alterner le like sur une publication
async function toggleLike(publication: any) {
  try {
    if (publication.isLiked) {
      // Déliker
      const response = await unlikePublicationMutate({ postId: publication.id });
      if (response && response.data && response.data.unlikePublication) {
        publication.likesCount = response.data.unlikePublication.likesCount;
        publication.isLiked = false;
      } else {
        console.error("Réponse invalide pour unlikePublication");
      }
    } else {
      // Liker
      const response = await likePublicationMutate({ postId: publication.id });
      if (response && response.data && response.data.likePublication) {
        publication.likesCount = response.data.likePublication.likesCount;
        publication.isLiked = true;
      } else {
        console.error("Réponse invalide pour likePublication");
      }
    }
    // Forcer le rafraîchissement des données via refetch
    refetch();
  } catch (err: any) {
    console.error("Erreur lors du toggle du like:", err);
  }
}



// Fonction pour vérifier si une publication est likée
const isLiked = (id: number): boolean => likedPosts.value.includes(id);
</script>

<template>
  <div>
    <h1>Articles Récents</h1>

    <!-- Formulaire de filtres -->
    <div class="filters">
      <label>
        Auteur (ID):
        <input
          type="text"
          @input="(e: Event) => {
            const input = e.target as HTMLInputElement;
            const parsedId = parseInt(input.value);
            // Si parsedId n'est pas un nombre valide, on passe null
            updateFilter(isNaN(parsedId) ? null : parsedId, sortByLikes);
          }"
          placeholder="Entrez un ID d'auteur"
        />
      </label>
      <label>
        Trier par nombre de likes:
        <input
          type="checkbox"
          @change="(e: Event) => {
            const input = e.target as HTMLInputElement;
            updateFilter(authorId, input.checked);
          }"
        />
      </label>
    </div>

    <!-- Affichage de la pagination (optionnel) -->
    <div class="pagination">
      <button @click="changePage(page - 1)" :disabled="page === 1">
        Précédent
      </button>
      <button @click="changePage(page + 1)">
        Suivant
      </button>
    </div>

    <div v-if="loading">Chargement des publications...</div>
    <div v-else-if="error">Erreur : {{ error.message }}</div>
    <div v-else>
      <div v-if="result && result.getPublications">
        <div
          v-for="pub in result.getPublications.publications"
          :key="pub.id"
          class="article"
        >
          <h2>{{ pub.title }}</h2>
          <p>{{ pub.content }}</p>
          <p>
            <small>
              Auteur: {{ pub.author.name }} | Likes: {{ pub.likesCount }}
            </small>
          </p>
          <!-- Bouton pour liker/déliker -->
          <button @click="toggleLike(pub)">
            {{ isLiked(pub.id) ? "Unlike" : "Like" }}
          </button>
          <hr />
        </div>
      </div>
      <div v-else>
        <p>Aucune publication trouvée.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: 1rem;
}
.pagination {
  margin-bottom: 1rem;
}
.article {
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #2196f3;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #1976d2;
}
</style>
