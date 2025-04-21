export const userTypeDefs = /* GraphQL */ `
  type User {
    id: Int!
    email: String!
    password: String!
    name: String
    posts: [Post!]!
    comments: [Comment!]!
    likes: [Like!]!
    createdAt: String!
  }

  type UserPagination {
    users: [User!]!
    total: Int!
    totalPages: Int!
    currentPage: Int!
  }

  input UpdateUserInput {
    email: String
    name: String
  }

  extend type Query {
    getUser(id: Int!): User
    getUsers(page: Int): UserPagination
  }

  extend type Mutation {
    signup(email: String!, password: String!, name: String): String!
    login(email: String!, password: String!, getToken: Boolean): String!
    updateUser(id: Int!, data: UpdateUserInput!): User!
    deleteUser(id: Int!): DeletionMessage!
  }
`;
