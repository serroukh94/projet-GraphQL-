import { ApolloServer } from 'apollo-server';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';
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
