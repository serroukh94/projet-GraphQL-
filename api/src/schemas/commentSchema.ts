// src/schemas/commentSchema.ts
import { gql } from 'apollo-server';

export const commentTypeDefs = gql`
  # Définition du type Comment
  type Comment {
    id: Int!
    content: String!
    createdAt: String!
    author: User!
    post: Post!
  }

  # Optionnel : une query pour récupérer les commentaires d'un article
  extend type Query {
    comments(postId: Int!): [Comment!]!
  }

  # Input pour la création d'un commentaire
  input CreateCommentInput {
    content: String!
    postId: Int!
  }

  # Mutation pour permettre à un utilisateur de commenter un article
  extend type Mutation {
    createComment(data: CreateCommentInput!): Comment!
  }
`;
