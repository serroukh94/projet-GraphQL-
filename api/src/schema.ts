// src/schema.ts
import { gql } from 'apollo-server';
import { typeDefs as userTypeDefs } from './schemas/userSchema';
import { publicationTypeDefs } from './schemas/publicationSchema';
// Ajoutez d'autres schémas si nécessaire

export const typeDefs = gql`
  ${userTypeDefs}
  ${publicationTypeDefs}
  # Ajoutez ici d'autres schémas, par exemple pour les commentaires...
`;
