import { gql } from 'apollo-server';

export const likeTypeDefs = gql`
  type Like {
    id: Int!
    post: Post!
    user: User!
    createdAt: String!
  }

  type Mutation {
    likePublication(postId: Int!): Like!
    unlikePublication(postId: Int!): MessageResponse!
  }

  type Query {
    likes(postId: Int!): [Like!]!
  }

  type MessageResponse {
    message: String!
  }
`;
