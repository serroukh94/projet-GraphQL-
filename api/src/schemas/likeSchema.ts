import { gql } from 'apollo-server';

export const likeTypeDefs = gql`
  type Like {
    id: Int!
    createdAt: String!
    user: User!
    post: Post!
  }
`;
