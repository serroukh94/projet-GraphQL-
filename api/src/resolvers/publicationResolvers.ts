// src/resolvers/publicationResolvers.ts
import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 4;

export const publicationResolvers = {
  Query: {
    /**
     * Récupère une liste paginée d'articles.
     */
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
          // On n'inclut pas directement les commentaires ou likes ici
          // Si vous souhaitez charger ces relations, pensez à les inclure ou à définir des resolvers personnalisés pour Post.comments & Post.likes.
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

    /**
     * Récupère un article par son ID.
     */
    getPublication: async (
      _: unknown,
      args: { id: number }
    ): Promise<Post> => {
      const publication = await prisma.post.findUnique({
        where: { id: args.id },
        include: {
          author: true,
          // Optionnel : charger les commentaires et les likes
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
    /**
     * Crée une nouvelle publication.
     */
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

      const title = args.data.title ?? 'Publication'; // Titre par défaut si non fourni

      const newPost = await prisma.post.create({
        data: {
          title,
          content: args.data.text,
          author: { connect: { id: context.user.id } },
        },
        include: {
          author: true,
          // Vous pouvez choisir d'inclure les commentaires et likes si nécessaire
        },
      });
      return newPost;
    },

    /**
     * Met à jour un article existant.
     */
    updatePublication: async (
      _: unknown,
      args: { id: number; data: { title?: string; content?: string } },
      context: { user?: { id: number } }
    ): Promise<Post> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }

      // Vérifier que l'article existe et qu'il appartient à l'utilisateur
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
          title: args.data.title,      // Si défini, le titre sera mis à jour
          content: args.data.content,  // Même chose pour le contenu
        },
        include: { author: true },
      });
      return updatedPublication;
    },

    /**
     * Supprime un article.
     */
    deletePublication: async (
      _: unknown,
      args: { id: number },
      context: { user?: { id: number } }
    ): Promise<{ message: string }> => {
      if (!context.user) {
        throw new Error('Authentification requise.');
      }

      // Vérifier que l'article existe et qu'il appartient à l'utilisateur
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
  },

  // Resolver de champs personnalisés pour le type Post
  Post: {
    // Résolution dynamique pour les commentaires
    comments: async (parent: Post) => {
      return await prisma.comment.findMany({
        where: { postId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
    // // Résolution dynamique pour les likes
    // likes: async (parent: Post) => {
    //   return await prisma.like.findMany({
    //     where: { postId: parent.id },
    //   });
    // },
    // // Champ personnalisé pour le nombre de likes
    // likesCount: async (parent: Post) => {
    //   return await prisma.like.count({
    //     where: { postId: parent.id },
    //   });
    // },
  },
};
