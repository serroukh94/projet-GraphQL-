import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    name: String
    posts: [Post!]!
  }

  type UsersPagination {
    users: [User!]!
    total: Int!
    totalPages: Int!
    currentPage: Int!
  }

  # Input pour la création d'un post
  input CreatePostInput {
    title: String!
    content: String!
    authorId: Int!
  }

  type Query {
    # Requêtes concernant les utilisateurs
    getUser(id: Int!): User
    getUsers(page: Int): UsersPagination!
    # Requêtes concernant les posts
    posts(authorId: Int, sortByLikes: Boolean): [Post!]!
    post(id: Int!): Post
  }

  input UpdateUserInput {
    email: String
    name: String
  }

  type DeleteResponse {
    message: String!
  }

  type Mutation {
    # Mutations concernant les utilisateurs
    signup(email: String!, password: String!, name: String): String!
    login(email: String!, password: String!, getToken: Boolean): String
    updateUser(id: Int!, data: UpdateUserInput!): User!
    deleteUser(id: Int!): DeleteResponse!
    # Mutations concernant les posts
    createPost(data: CreatePostInput!): Post!
    deletePost(id: Int!): Boolean!
  }
`;
