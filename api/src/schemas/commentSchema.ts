export const commentTypeDefs = /* GraphQL */ `
  type Comment {
    id: Int!
    content: String!
    post: Post!
    author: User!
    createdAt: String!
  }

  input CreateCommentInput {
    content: String!
    postId: Int!
  }

  extend type Query {
    comments(postId: Int!): [Comment!]!
  }

  extend type Mutation {
    createComment(data: CreateCommentInput!): Comment!
    updateComment(id: Int!, content: String!): Comment!
    deleteComment(id: Int!): DeletionMessage!
  }
`;
