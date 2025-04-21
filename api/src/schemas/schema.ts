import { gql } from 'apollo-server';
import { commonTypeDefs } from './commonSchema';
import { userTypeDefs } from './userSchema';
import { publicationTypeDefs } from './publicationSchema';
import { commentTypeDefs } from './commentSchema';
import { likeTypeDefs } from './likeSchema';

export const typeDefs = gql`
  ${commonTypeDefs}
  ${userTypeDefs}
  ${publicationTypeDefs}
  ${commentTypeDefs}
  ${likeTypeDefs}
`;
