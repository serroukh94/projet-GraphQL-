// src/schema.ts
import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    name: String
    posts: [Post!]!
  }

  type Post {
    id: Int!
    title: String!
    content: String!
    createdAt: String!
    author: User!
  }

  type UsersPagination {
    users: [User!]!
    total: Int!
    totalPages: Int!
    currentPage: Int!
  }

  type Query {
    # Définition de la query getUser, attend un argument id de type Int
    getUser(id: Int!): User

    # La query getUsers retourne une pagination d'utilisateurs
    getUsers(page: Int): UsersPagination!

  }

  input UpdateUserInput {
    email: String
    name: String
  }

  type DeleteResponse {
    message: String!
  }

  type Mutation {
    # Inscription renvoie un token (String)
    signup(email: String!, password: String!, name: String): String!

    # Login renvoie soit un token, soit l'utilisateur sans password
    login(email: String!, password: String!, getToken: Boolean): String

    # Mise à jour d'un utilisateur
    updateUser(id: Int!, data: UpdateUserInput!): User!

    # Suppression d'un utilisateur
    deleteUser(id: Int!): DeleteResponse!
  }
`;
