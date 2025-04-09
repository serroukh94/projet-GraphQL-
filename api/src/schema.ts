// src/schema.ts
import { gql } from 'apollo-server';
import { typeDefs as userTypeDefs } from './schemas/userSchema';
import { publicationTypeDefs } from './schemas/publicationSchema';
import { commentTypeDefs } from './schemas/commentSchema';

export const typeDefs = gql`
  ${userTypeDefs}
  ${publicationTypeDefs}
  ${commentTypeDefs}
`;
