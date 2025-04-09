import { gql } from 'apollo-server';

export const publicationTypeDefs = gql`
type Post {
  id: Int!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  likes: [Like!]!
  likesCount: Int!
  createdAt: String!
}

  # Pour la pagination, on retourne un objet qui contient la liste et des infos complémentaires
  type PublicationsPagination {
    totalItems: Int!
    totalPages: Int!
    currentPage: Int!
    itemsPerPage: Int!
    publications: [Post!]!
  }

type Query {
  posts(authorId: Int, sortByLikes: Boolean): [Post!]!
  getPublication(id: Int!): Post!
}

  type Mutation {
    createPublication(data: CreatePublicationInput!): Post!
    updatePublication(id: Int!, data: UpdatePublicationInput!): Post!
    deletePublication(id: Int!): MessageResponse!
  }

  input CreatePublicationInput {
    title: String
    text: String!
  }

  input UpdatePublicationInput {
    title: String
    content: String
  }

  type MessageResponse {
    message: String!
  }
`;
