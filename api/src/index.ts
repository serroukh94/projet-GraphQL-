import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schemas/userSchema';
import { resolvers } from './resolvers';

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Si besoin, ajoutez ici la logique d'authentification (extraction du JWT)
      return {};
    },
  });

  const { url } = await server.listen({ port: 4000 });
  console.log(`Server ready at ${url}`);
}

startServer();
