// src/schema.ts
import { gql } from 'apollo-server';
import { typeDefs as userTypeDefs } from './userSchema';
import { publicationTypeDefs } from './publicationSchema';
import { commentTypeDefs } from './commentSchema';
import { likeTypeDefs } from './likeSchema';

export const typeDefs = gql`
  ${userTypeDefs}
  ${publicationTypeDefs}
  ${commentTypeDefs}
  ${likeTypeDefs}
`;
