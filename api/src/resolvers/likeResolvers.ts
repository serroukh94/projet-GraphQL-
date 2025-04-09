import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();

export const likeResolvers = {
  Mutation: {
    /**
     * Ajoute un like pour un article.
     * Vérifie que l'utilisateur est authentifié et qu'il n'a pas déjà liké l'article.
     */
    likePublication: async (
      _: unknown,
      args: { postId: number },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }

      // Vérifier si l'utilisateur a déjà liké cet article
      const existingLike = await prisma.like.findFirst({
        where: {
          postId: args.postId,
          userId: context.user.id,
        },
      });
      if (existingLike) {
        throw new Error("Vous avez déjà liké cet article.");
      }

      // Créer le like
      await prisma.like.create({
        data: {
          post: { connect: { id: args.postId } },
          user: { connect: { id: context.user.id } },
        },
      });

      // Récupérer l'article mis à jour (avec potentiellement un resolver de likesCount)
      const post = await prisma.post.findUnique({
        where: { id: args.postId },
        include: { author: true },
      });
      if (!post) {
        throw new Error("Article non trouvé.");
      }
      return post;
    },

    /**
     * Supprime le like de l'utilisateur pour un article.
     */
    unlikePublication: async (
      _: unknown,
      args: { postId: number },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }

      // Vérifier que l'utilisateur a déjà liké l'article
      const existingLike = await prisma.like.findFirst({
        where: {
          postId: args.postId,
          userId: context.user.id,
        },
      });
      if (!existingLike) {
        throw new Error("Vous n'avez pas liké cet article.");
      }

      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      const post = await prisma.post.findUnique({
        where: { id: args.postId },
        include: { author: true },
      });
      if (!post) {
        throw new Error("Article non trouvé.");
      }
      return post;
    },
  },
};
