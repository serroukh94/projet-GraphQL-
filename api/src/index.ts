import { ApolloServer } from 'apollo-server';
import { userResolvers } from './resolvers';
import { config } from './config';
import { getUserFromToken } from './utils/auth';
import { typeDefs } from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers: userResolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { user };
  },
});

server.listen({ port: config.port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
