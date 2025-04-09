// src/resolvers/index.ts
import { userResolvers } from './userResolvers';
import { publicationResolvers } from './publicationResolvers';
import { commentResolvers } from './commentResolvers';
import { likeResolvers } from './likeResolvers';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...publicationResolvers.Query,
    ...commentResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...publicationResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...likeResolvers.Mutation,
  },
};
