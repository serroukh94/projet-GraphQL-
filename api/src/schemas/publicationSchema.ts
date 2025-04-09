import { gql } from 'apollo-server';

export const publicationTypeDefs = gql`
  # Déclaration du type Article (ici nommé Post pour correspondre à votre modèle Prisma)
  type Post {
    id: Int!
    title: String!
    content: String!
    createdAt: String!
    author: User!
    # comments: [Comment!]!
    # likes: [Like!]!
    # likesCount: Int!
  }

  # Pour la pagination, on retourne un objet qui contient la liste et des infos complémentaires
  type PublicationsPagination {
    totalItems: Int!
    totalPages: Int!
    currentPage: Int!
    itemsPerPage: Int!
    publications: [Post!]!
  }

  # On étend la Query pour inclure les opérations de lecture d'articles
  extend type Query {
    getPublications(page: Int): PublicationsPagination!
    getPublication(id: Int!): Post
  }

  # Input pour la création d'un article
  input CreatePublicationInput {
    text: String!  # On utilise "text" comme contenu de la publication
    title: String   # Optionnellement, un titre peut être fourni
  }

  # Input pour la mise à jour d'un article
  input UpdatePublicationInput {
    title: String
    content: String
  }

  # Type de réponse pour les suppressions
  type DeleteResponse {
    message: String!
  }

  extend type Mutation {
    createPublication(data: CreatePublicationInput!): Post!
    updatePublication(id: Int!, data: UpdatePublicationInput!): Post!
    deletePublication(id: Int!): DeleteResponse!
  }
`;
