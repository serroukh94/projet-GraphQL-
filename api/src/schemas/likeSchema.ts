export const likeTypeDefs = /* GraphQL */ `
  type Like {
    id: Int!
    post: Post!
    user: User!
    createdAt: String!
  }

  extend type Mutation {
    likePublication(postId: Int!): Post!
    unlikePublication(postId: Int!): Post!
  }

  extend type Mutation {
  likePublication(postId: Int!): Post!
  unlikePublication(postId: Int!): Post!
}

`;

