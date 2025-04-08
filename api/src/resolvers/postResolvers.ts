import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const postResolvers = {
  Query: {
    // Récupère la liste des posts, avec option de filtrer par auteur et trier par popularité.
    posts: async (
      _parent: unknown,
      args: { authorId?: number; sortByLikes?: boolean }
    ) => {
      const whereClause = args.authorId ? { authorId: args.authorId } : undefined;
      
      // Pour trier par popularité, nous utilisons des assertions de type pour préciser que 'desc' est un littéral.
      const orderByClause = args.sortByLikes
        ? ({ likes: { _count: 'desc' } } as const)
        : ({ createdAt: 'desc' } as const);

      return await prisma.post.findMany({
        where: whereClause,
        orderBy: orderByClause,
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });
    },
    
    // Récupère un post spécifique par son ID
    post: async (_parent: unknown, args: { id: number }) => {
      return await prisma.post.findUnique({
        where: { id: args.id },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });
    },
  },

  Mutation: {
    // Crée un post
    createPost: async (
      _parent: unknown,
      args: { data: { title: string; content: string; authorId: number } }
    ) => {
      return await prisma.post.create({
        data: {
          title: args.data.title,
          content: args.data.content,
          authorId: args.data.authorId,
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });
    },

    // Supprime un post
    deletePost: async (_parent: unknown, args: { id: number }) => {
      await prisma.post.delete({
        where: { id: args.id },
      });
      return true;
    },
  },

  // Champs personnalisés pour le type Post
  Post: {
    likesCount: async (parent: { id: number }) => {
      // Calcule le nombre de likes associés à ce post
      const count = await prisma.like.count({
        where: { postId: parent.id },
      });
      return count;
    },
  },
};
