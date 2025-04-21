import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();

export const likeResolvers = {
  Mutation: {
    likePublication: async (
      _: unknown,
      args: { postId: number },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) throw new Error('Authentification requise.');
      const existingLike = await prisma.like.findFirst({
        where: { postId: args.postId, userId: context.user.id },
      });
      if (existingLike) throw new Error("Vous avez déjà liké cet article.");
      await prisma.like.create({
        data: {
          post: { connect: { id: args.postId } },
          user: { connect: { id: context.user.id } },
        },
      });
      const post = await prisma.post.findUnique({
        where: { id: args.postId },
        include: { author: true },
      });
      if (!post) throw new Error("Article non trouvé.");
      return post;
    },

    unlikePublication: async (
      _: unknown,
      args: { postId: number },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) throw new Error('Authentification requise.');
      const existingLike = await prisma.like.findFirst({
        where: { postId: args.postId, userId: context.user.id },
      });
      if (!existingLike) throw new Error("Vous n'avez pas liké cet article.");
      await prisma.like.delete({ where: { id: existingLike.id } });
      const post = await prisma.post.findUnique({
        where: { id: args.postId },
        include: { author: true },
      });
      if (!post) throw new Error("Article non trouvé.");
      return post;
    },
  },
};
