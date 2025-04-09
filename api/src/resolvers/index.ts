// src/resolvers/index.ts
import { userResolvers } from './userResolvers';
import { publicationResolvers } from './publicationResolvers';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...publicationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...publicationResolvers.Mutation,
  },
};
