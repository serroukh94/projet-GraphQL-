import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 4;

export const publicationResolvers = {
  Query: {
    getPublications: async (
      _: unknown,
      args: { page?: number },
      context: { user?: { id: number } }
    ): Promise<{
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
      publications: Post[];
    }> => {
      const page = args.page && args.page > 0 ? args.page : 1;
      const totalItems = await prisma.post.count();
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      const publications = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        include: {
          author: true,
          // Vous pouvez inclure les commentaires ici si besoin
        },
      });
      if (publications.length === 0) {
        throw new Error('Aucune publication disponible.');
      }
      return {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: ITEMS_PER_PAGE,
        publications,
      };
    },
    getPublication: async (
      _: unknown,
      args: { id: number }
    ): Promise<Post> => {
      const publication = await prisma.post.findUnique({
        where: { id: args.id },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
      });
      if (!publication) {
        throw new Error('Publication non trouvée.');
      }
      return publication;
    },
  },

  Mutation: {
    createPublication: async (
      _: unknown,
      args: { data: { text: string; title?: string } },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!args.data.text) {
        throw new Error('Le champ text est nécessaire!');
      }
      if (!context.user) {
        throw new Error('Authentification requise.');
      }
      const title = args.data.title ?? 'Publication';
      const newPost = await prisma.post.create({
        data: {
          title,
          content: args.data.text,
          author: { connect: { id: context.user.id } },
        },
        include: {
          author: true,
        },
      });
      return newPost;
    },
    updatePublication: async (
      _: unknown,
      args: { id: number; data: { title?: string; content?: string } },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }
      const publication = await prisma.post.findUnique({
        where: { id: args.id },
      });
      if (!publication) {
        throw new Error("L'article n'existe pas.");
      }
      if (publication.authorId !== context.user.id) {
        throw new Error("Vous n'êtes pas autorisé à modifier cet article.");
      }
      const updatedPublication = await prisma.post.update({
        where: { id: args.id },
        data: {
          title: args.data.title,
          content: args.data.content,
        },
        include: { author: true },
      });
      return updatedPublication;
    },
    deletePublication: async (
      _: unknown,
      args: { id: number },
      context: { user?: { id: number } }
    ): Promise<{ message: string }> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }
      const publication = await prisma.post.findUnique({
        where: { id: args.id },
      });
      if (!publication) {
        throw new Error("L'article n'existe pas.");
      }
      if (publication.authorId !== context.user.id) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cet article.");
      }
      await prisma.post.delete({
        where: { id: args.id },
      });
      return { message: "L'article a été supprimé avec succès." };
    },
    // Mutations pour le système de Like
    likePublication: async (
      _: unknown,
      args: { postId: number },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }
      const existingLike = await prisma.like.findFirst({
        where: {
          postId: args.postId,
          userId: context.user.id,
        },
      });
      if (existingLike) {
        throw new Error("Vous avez déjà liké cet article.");
      }
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
      if (!post) {
        throw new Error("Article non trouvé.");
      }
      return post;
    },
    unlikePublication: async (
      _: unknown,
      args: { postId: number },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }
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

  Post: {
    comments: async (parent: Post) => {
      return await prisma.comment.findMany({
        where: { postId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
    likes: async (parent: Post) => {
      return await prisma.like.findMany({
        where: { postId: parent.id },
      });
    },
    likesCount: async (parent: Post): Promise<number> => {
      const count = await prisma.like.count({
        where: { postId: parent.id },
      });
      return count ?? 0;
    },
    isLiked: async (parent: Post, _: unknown, context: { user?: { id: number } }): Promise<boolean> => {
      if (!context.user) return false;
      const existingLike = await prisma.like.findFirst({
        where: {
          postId: parent.id,
          userId: context.user.id,
        },
      });
      return Boolean(existingLike);
    },
  },
};
