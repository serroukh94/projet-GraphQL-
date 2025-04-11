import { PrismaClient, Comment } from '@prisma/client';

const prisma = new PrismaClient();

export const commentResolvers = {
  Query: {
    comments: async (_: unknown, args: { postId: number }): Promise<Comment[]> => {
      const comments = await prisma.comment.findMany({
        where: { postId: args.postId },
        include: { author: true, post: true },
        orderBy: { createdAt: 'desc' },
      });
      // Modification : filtrer pour ne conserver que les commentaires dont l'auteur est défini
      return comments.filter(comment => comment.author && comment.author.id != null);
    },
  },

  Mutation: {
    createComment: async (
      _: unknown,
      args: { data: { content: string; postId: number } },
      context: { user?: { id: number } }
    ): Promise<Comment> => {
      if (!context.user) throw new Error('Authentification requise.');
      return await prisma.comment.create({
        data: {
          content: args.data.content,
          post: { connect: { id: args.data.postId } },
          author: { connect: { id: context.user.id } },
        },
        include: { author: true, post: true },
      });
    },

    updateComment: async (
      _: unknown,
      args: { id: number; content: string },
      context: { user?: { id: number } }
    ): Promise<Comment> => {
      if (!context.user) throw new Error('Authentification requise.');
      const comment = await prisma.comment.findUnique({ where: { id: args.id } });
      if (!comment) throw new Error('Commentaire non trouvé.');
      if (comment.authorId !== context.user.id) throw new Error('Non autorisé.');
      return await prisma.comment.update({
        where: { id: args.id },
        data: { content: args.content },
        include: { author: true, post: true },
      });
    },

    deleteComment: async (
      _: unknown,
      args: { id: number },
      context: { user?: { id: number } }
    ): Promise<{ message: string }> => {
      if (!context.user) throw new Error('Authentification requise.');
      const comment = await prisma.comment.findUnique({ where: { id: args.id } });
      if (!comment) throw new Error('Commentaire non trouvé.');
      if (comment.authorId !== context.user.id) throw new Error('Non autorisé.');
      await prisma.comment.delete({ where: { id: args.id } });
      return { message: 'Commentaire supprimé avec succès.' };
    },
  },
};
