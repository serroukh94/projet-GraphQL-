import { gql } from 'apollo-server';

export const postTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    author: User!
    comments: [Comment!]!
    likes: [Like!]!
    likesCount: Int!
  }

  extend type Query {
    # La query pour récupérer les posts, avec des filtres optionnels
    posts(authorId: Int, sortByLikes: Boolean): [Post!]!
    post(id: Int!): Post
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: Int!
  }

  extend type Mutation {
    createPost(data: CreatePostInput!): Post!
    deletePost(id: Int!): Boolean!
    # Vous pouvez ajouter une mutation updatePost si besoin
  }
`;
