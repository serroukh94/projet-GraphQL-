<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

/* ----------------- QUERY ----------------- */
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
      comments {
        id
        content
        createdAt
        author {
          id
          name
        }
      }
    }
  }
`

// Variables de filtre
const authorId = ref<number | null>(null)
const sortByLikes = ref(false)

// Exécution de la query
const { result, loading, error, refetch } = useQuery(GET_POSTS, () => ({
  authorId: authorId.value,
  sortByLikes: sortByLikes.value,
}))

// Fonction pour mettre à jour les filtres et rafraîchir la query
function updateFilter(newAuthorId: number | null, newSortByLikes: boolean) {
  authorId.value = newAuthorId
  sortByLikes.value = newSortByLikes
  refetch()
}

/* ----------------- MUTATIONS ----------------- */

// Création d'un post
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
const { mutate: createPublication, onDone: onCreatePublicationDone, onError: onCreatePublicationError } = useMutation(CREATE_PUBLICATION)
onCreatePublicationDone(() => {
  newPostTitle.value = ''
  newPostContent.value = ''
  refetch()
})
onCreatePublicationError((err) => {
  newPostError.value = err.message
})

// Like d'un post
const LIKE_PUBLICATION = gql`
  mutation LikePublication($postId: Int!) {
    likePublication(postId: $postId) {
      id
      likesCount
    }
  }
`
const { mutate: likePublication, onDone: onLikePublicationDone } = useMutation(LIKE_PUBLICATION)
onLikePublicationDone(() => refetch())

// Unlike d'un post
const UNLIKE_PUBLICATION = gql`
  mutation UnlikePublication($postId: Int!) {
    unlikePublication(postId: $postId) {
      id
      likesCount
    }
  }
`
const { mutate: unlikePublication, onDone: onUnlikePublicationDone } = useMutation(UNLIKE_PUBLICATION)
onUnlikePublicationDone(() => refetch())

// Mise à jour d'un post
const UPDATE_PUBLICATION = gql`
  mutation UpdatePublication($id: Int!, $data: UpdatePublicationInput!) {
    updatePublication(id: $id, data: $data) {
      id
      title
      content
    }
  }
`
const { mutate: updatePublication, onDone: onUpdatePublicationDone } = useMutation(UPDATE_PUBLICATION)
onUpdatePublicationDone(() => refetch())

// Suppression d'un post
const DELETE_PUBLICATION = gql`
  mutation DeletePublication($id: Int!) {
    deletePublication(id: $id) {
      message
    }
  }
`
const { mutate: deletePublication, onDone: onDeletePublicationDone } = useMutation(DELETE_PUBLICATION)
onDeletePublicationDone(() => refetch())

// Création d'un commentaire
const CREATE_COMMENT = gql`
  mutation CreateComment($data: CreateCommentInput!) {
    createComment(data: $data) {
      id
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`
const { mutate: createComment, onDone: onCreateCommentDone } = useMutation(CREATE_COMMENT)
onCreateCommentDone(() => refetch())

// Mise à jour d'un commentaire
const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: Int!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
    }
  }
`
const { mutate: updateComment, onDone: onUpdateCommentDone } = useMutation(UPDATE_COMMENT)
onUpdateCommentDone(() => refetch())

// Suppression d'un commentaire
const DELETE_COMMENT = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      message
    }
  }
`
const { mutate: deleteComment, onDone: onDeleteCommentDone } = useMutation(DELETE_COMMENT)
onDeleteCommentDone(() => refetch())

/* ----------------- VARIABLES RÉACTIVES ----------------- */

// Pour la création d'un nouveau post
const newPostTitle = ref('')
const newPostContent = ref('')
const newPostError = ref('')

// Pour l'édition d'un post (clé = id du post)
const editMode = reactive<{ [key: number]: boolean }>({})
const editPostTitle = reactive<{ [key: number]: string }>({})
const editPostContent = reactive<{ [key: number]: string }>({})

// Pour la création d'un commentaire par post (clé = id du post)
const newComment = reactive<{ [key: number]: string }>({})

// Pour l'édition d'un commentaire (clé = id du commentaire)
const editCommentMode = reactive<{ [key: number]: boolean }>({})
const editCommentText = reactive<{ [key: number]: string }>({})

/* ----------------- FONCTIONS ----------------- */

// Soumettre la création d'un nouveau post
function submitCreatePost() {
  if (!newPostContent.value) {
    newPostError.value = 'Le contenu est obligatoire !'
    return
  }
  createPublication({
    data: {
      title: newPostTitle.value || 'Publication',
      text: newPostContent.value,
    },
  })
}

// Gérer le like et l'unlike d'un post
function handleLike(postId: number) {
  likePublication({ postId })
}
function handleUnlike(postId: number) {
  unlikePublication({ postId })
}

// Gestion de l'édition d'un post
function toggleEditPost(postId: number, currentTitle: string, currentContent: string) {
  editMode[postId] = true
  editPostTitle[postId] = currentTitle
  editPostContent[postId] = currentContent
}
function submitEditPost(postId: number) {
  updatePublication({
    id: postId,
    data: {
      title: editPostTitle[postId],
      content: editPostContent[postId],
    },
  })
  editMode[postId] = false
}
function cancelEditPost(postId: number) {
  editMode[postId] = false
}

// Suppression d'un post
function handleDeletePost(postId: number) {
  if (confirm('Voulez-vous vraiment supprimer ce post ?')) {
    deletePublication({ id: postId })
  }
}

// Création d'un commentaire pour un post
function handleCreateComment(postId: number) {
  if (!newComment[postId] || newComment[postId].trim() === '') return
  createComment({
    data: { content: newComment[postId], postId },
  })
  newComment[postId] = ''
}

// Gestion de l'édition d'un commentaire
function toggleEditComment(commentId: number, currentContent: string) {
  editCommentMode[commentId] = true
  editCommentText[commentId] = currentContent
}
function submitEditComment(commentId: number) {
  updateComment({ id: commentId, content: editCommentText[commentId] })
  editCommentMode[commentId] = false
}
function cancelEditComment(commentId: number) {
  editCommentMode[commentId] = false
}

// Suppression d'un commentaire
function handleDeleteComment(commentId: number) {
  if (confirm('Supprimer ce commentaire ?')) {
    deleteComment({ id: commentId })
  }
}
</script>

<template>
  <div>
    <h1>Articles Récents</h1>

    <!-- Formulaire de filtres -->
    <div class="filters">
      <label>
        Auteur (ID) :
        <input type="text" @input="(e) => updateFilter(parseInt((e.target as HTMLInputElement).value) || null, sortByLikes)" placeholder="Entrez un ID d'auteur" />
      </label>
      <label>
        Trier par nombre de likes :
        <input type="checkbox" @change="(e) => updateFilter(authorId, (e.target as HTMLInputElement).checked)" />
      </label>
    </div>

    <!-- Formulaire de création d'un nouveau post -->
    <div class="create-post">
      <h2>Créer un nouvel article</h2>
      <form @submit.prevent="submitCreatePost">
        <div>
          <input v-model="newPostTitle" placeholder="Titre (optionnel)" />
        </div>
        <div>
          <textarea v-model="newPostContent" placeholder="Contenu"></textarea>
        </div>
        <button type="submit">Publier</button>
        <p v-if="newPostError" class="error">{{ newPostError }}</p>
      </form>
    </div>

    <!-- Affichage des posts -->
    <div v-if="loading">Chargement des posts...</div>
    <div v-else-if="error">Erreur : {{ error.message }}</div>
    <div v-else>
      <div v-for="post in result.posts" :key="post.id" class="article">
        <!-- Affichage standard d'un post -->
        <div v-if="!editMode[post.id]">
          <h2>{{ post.title }}</h2>
          <p>{{ post.content }}</p>
          <p>
            <small>Auteur : {{ post.author.name }} | Likes : {{ post.likesCount }}</small>
          </p>
          <div class="post-actions">
            <button @click="handleLike(post.id)">Like</button>
            <button @click="handleUnlike(post.id)">Unlike</button>
            <button @click="toggleEditPost(post.id, post.title, post.content)">Edit</button>
            <button @click="handleDeletePost(post.id)">Delete</button>
          </div>
        </div>
        <!-- Formulaire d'édition d'un post -->
        <div v-else>
          <input v-model="editPostTitle[post.id]" placeholder="Titre" />
          <textarea v-model="editPostContent[post.id]" placeholder="Contenu"></textarea>
          <button @click="submitEditPost(post.id)">Enregistrer</button>
          <button @click="cancelEditPost(post.id)">Annuler</button>
        </div>

        <!-- Section commentaires -->
        <div class="comments">
          <h3>Commentaires</h3>
          <!-- Liste des commentaires -->
          <div v-for="comment in post.comments" :key="comment.id" class="comment">
            <div v-if="!editCommentMode[comment.id]">
              <p>{{ comment.content }} - <em>{{ comment.author.name }}</em></p>
              <button @click="toggleEditComment(comment.id, comment.content)">Edit</button>
              <button @click="handleDeleteComment(comment.id)">Delete</button>
            </div>
            <div v-else>
              <input v-model="editCommentText[comment.id]" placeholder="Modifier le commentaire" />
              <button @click="submitEditComment(comment.id)">Enregistrer</button>
              <button @click="cancelEditComment(comment.id)">Annuler</button>
            </div>
          </div>
          <!-- Formulaire pour ajouter un commentaire -->
          <div class="add-comment">
            <input :placeholder="'Ajouter un commentaire au post ' + post.id" v-model="newComment[post.id]" />
            <button @click="handleCreateComment(post.id)">Envoyer</button>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: 1rem;
}
.create-post {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
}
.article {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
}
.post-actions button {
  margin-right: 0.5rem;
}
.comments {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #eee;
}
.comment {
  margin-bottom: 0.5rem;
}
.error {
  color: red;
}
</style>
