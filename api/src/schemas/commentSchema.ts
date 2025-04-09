// import { gql } from 'apollo-server';

// export const commentTypeDefs = gql`
//   type Comment {
//     id: ID!
//     content: String!
//     createdAt: String!
//     author: User!
//     post: Post!
//   }

//   extend type Query {
//     # Optionnel : récupère les commentaires d'un article
//     comments(postId: Int!): [Comment!]!
//   }

//   input CreateCommentInput {
//     content: String!
//     postId: Int!
//   }

//   extend type Mutation {
//     createComment(data: CreateCommentInput!): Comment!
//   }
// `;
