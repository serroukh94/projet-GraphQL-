import { postResolvers } from './postResolvers';
import { userResolvers } from './userResolvers';

export const resolvers = [
  postResolvers,
  userResolvers,
  // commentResolvers,
  // likeResolvers,
];
