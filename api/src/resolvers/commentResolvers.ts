// src/resolvers/commentResolvers.ts
import { PrismaClient, Comment } from '@prisma/client';

const prisma = new PrismaClient();

export const commentResolvers = {
  Query: {
    /**
     * Retourne les commentaires liés à l'article spécifié par l'id.
     */
    comments: async (
      _: unknown,
      args: { postId: number }
    ): Promise<Comment[]> => {
      return await prisma.comment.findMany({
        where: { postId: args.postId },
        include: {
          author: true,
          post: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    /**
     * Crée un commentaire pour un article.
     * Seul un utilisateur authentifié peut commenter.
     */
    createComment: async (
      _: unknown,
      args: { data: { content: string; postId: number } },
      context: { user?: { id: number } }
    ): Promise<Comment> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }
      
      const newComment = await prisma.comment.create({
        data: {
          content: args.data.content,
          post: { connect: { id: args.data.postId } },
          author: { connect: { id: context.user.id } },
        },
        include: {
          author: true,
          post: true,
        },
      });
      return newComment;
    },
  },
};
