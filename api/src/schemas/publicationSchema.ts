export const publicationTypeDefs = /* GraphQL */ `
  type Post {
    id: Int!
    title: String!
    content: String!
    author: User!
    authorId: Int!
    comments: [Comment!]!
    likes: [Like!]!
    likesCount: Int!
    createdAt: String!
  }

  input CreatePublicationInput {
    text: String!
    title: String
  }

  input UpdatePublicationInput {
    title: String
    content: String
  }

  extend type Query {
    posts(authorId: Int, sortByLikes: Boolean): [Post!]!
    getPublication(id: Int!): Post
  }

  extend type Mutation {
    createPublication(data: CreatePublicationInput!): Post!
    updatePublication(id: Int!, data: UpdatePublicationInput!): Post!
    deletePublication(id: Int!): DeletionMessage!
  }
`;
