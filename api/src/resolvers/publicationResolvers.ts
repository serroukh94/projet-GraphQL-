import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();

export const publicationResolvers = {
  Query: {
    posts: async (
      _: unknown,
      args: { authorId?: number | null; sortByLikes?: boolean }
    ): Promise<(Post & { likesCount: number })[]> => {
      const whereClause = args.authorId != null ? { authorId: args.authorId } : {};

      const posts = await prisma.post.findMany({
        where: whereClause,
        orderBy: args.sortByLikes
          ? { likes: { _count: 'desc' } }
          : { createdAt: 'desc' },
        include: {
          author: true,
          comments: true,
          _count: { select: { likes: true } },
        },
      });

      return posts.map(post => ({
        ...post,
        likesCount: post._count.likes,
      }));
    },

    getPublication: async (
      _: unknown,
      args: { id: number }
    ): Promise<Post & { likesCount: number }> => {
      const publication = await prisma.post.findUnique({
        where: { id: args.id },
        include: {
          author: true,
          comments: true,
          _count: { select: { likes: true } },
        },
      });

      if (!publication) throw new Error('Publication non trouvée.');

      return {
        ...publication,
        likesCount: publication._count.likes,
      };
    },
  },

  Mutation: {
    createPublication: async (
      _: unknown,
      args: { data: { text: string; title?: string } },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!args.data.text) throw new Error('Le champ text est nécessaire!');
      if (!context.user) throw new Error('Authentification requise.');

      return prisma.post.create({
        data: {
          title: args.data.title ?? 'Publication',
          content: args.data.text,
          author: { connect: { id: context.user.id } },
        },
        include: { author: true, comments: true, likes: true },
      });
    },

    updatePublication: async (
      _: unknown,
      args: { id: number; data: { title?: string; content?: string } },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) throw new Error('Authentification requise.');

      const publication = await prisma.post.findUnique({ where: { id: args.id } });
      if (!publication) throw new Error("L'article n'existe pas.");
      if (publication.authorId !== context.user.id) throw new Error("Non autorisé.");

      return prisma.post.update({
        where: { id: args.id },
        data: { ...args.data },
        include: { author: true, comments: true, likes: true },
      });
    },

    deletePublication: async (
      _: unknown,
      args: { id: number },
      context: { user?: { id: number } }
    ): Promise<{ message: string }> => {
      if (!context.user) throw new Error('Authentification requise.');

      const publication = await prisma.post.findUnique({ where: { id: args.id } });
      if (!publication) throw new Error("L'article n'existe pas.");
      if (publication.authorId !== context.user.id) throw new Error("Non autorisé.");

      await prisma.post.delete({ where: { id: args.id } });
      return { message: "L'article a été supprimé avec succès." };
    },
  },

  Post: {
    comments: async (parent: Post) =>
      prisma.comment.findMany({ where: { postId: parent.id } }),

    likes: async (parent: Post) =>
      prisma.like.findMany({ where: { postId: parent.id } }),

    likesCount: async (parent: Post): Promise<number> =>
      prisma.like.count({ where: { postId: parent.id } }),
  },
};
