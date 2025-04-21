import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schemas/schema';
import { resolvers } from './resolvers';
import { getUserFromToken } from './utils/auth';

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token);
      console.log('user dans le contexte:', user);
      return { user };
    },
  });

  const { url } = await server.listen({ port: 3800 });
  console.log(`Server ready at ${url}`);
}

startServer();
