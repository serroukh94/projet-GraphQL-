import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';

/**
 * Fonction utilitaire pour générer un token JWT à partir d'un utilisateur.
 */
const createToken = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
};

const ITEMS_PER_PAGE = 5;

export const userResolvers = {
  Query: {
    /**
     * Récupère un utilisateur par son ID.
     */
    getUser: async (_: unknown, args: { id: number }, context: { user?: { id: number } }): Promise<User> => {
      const { id } = args;
      const foundUser = await prisma.user.findUnique({
        where: { id },
        include: { posts: true } 
      });
      if (!foundUser) {
        throw new Error("L'utilisateur n'existe pas");
      }
      return foundUser;
    },

    /**
     * Récupère une liste paginée d'utilisateurs.
     */
    getUsers: async (_: unknown, args: { page?: number }): Promise<{
      users: User[];
      total: number;
      totalPages: number;
      currentPage: number;
    }> => {
      const page = args.page && args.page > 0 ? args.page : 1;
      const skip = (page - 1) * ITEMS_PER_PAGE;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          orderBy: { id: 'desc' },
          skip,
          take: ITEMS_PER_PAGE
        }),
        prisma.user.count()
      ]);

      const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

      return {
        users,
        total,
        totalPages,
        currentPage: page,
      };
    },
  },

  Mutation: {
    /**
     * Inscription d'un nouvel utilisateur.
     */
    signup: async (_: unknown, args: { email: string; password: string; name?: string }): Promise<string> => {
      const email = args.email.toLowerCase();

      if (!args.email || !args.password) {
        throw new Error('Veuillez fournir tous les champs nécessaires (email et password au minimum)');
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("L'email est déjà utilisé");
      }

      const hashedPassword = await bcrypt.hash(args.password, SALT_ROUNDS);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: args.name ?? null,
        },
      });

      return createToken(newUser);
    },

    /**
     * Authentifie un utilisateur.
     */
    login: async (_: unknown, args: { email: string; password: string; getToken?: boolean }): Promise<string | Omit<User, 'password'>> => {
      const email = args.email.toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("L'utilisateur n'a pas pu être identifié");
      }

      const isValid = await bcrypt.compare(args.password, user.password);
      if (!isValid) {
        throw new Error("Mot de passe incorrect");
      }

      if (args.getToken) {
        return createToken(user);
      } else {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    },

    /**
     * Met à jour les informations d'un utilisateur.
     */
    updateUser: async (_: unknown, args: { id: number; data: Partial<{ email: string; name: string }> }, context: { user?: { id: number } }): Promise<User> => {
      const userId = args.id;
      if (context.user?.id !== userId) {
        throw new Error("Vous n'avez pas la permission de mettre à jour cet utilisateur.");
      }

      if (args.data.email) {
        const email = args.data.email.toLowerCase();
        const existingUser = await prisma.user.findFirst({
          where: {
            email,
            id: { not: userId }
          }
        });
        if (existingUser) {
          throw new Error("L'email est déjà utilisé");
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email: args.data.email ? args.data.email.toLowerCase() : undefined,
          name: args.data.name,
          // Ajoutez d'autres champs à mettre à jour si nécessaire.
        },
      });

      return updatedUser;
    },

    /**
     * Supprime un utilisateur.
     */
    deleteUser: async (_: unknown, args: { id: number }, context: { user?: { id: number } }): Promise<{ message: string }> => {
      const userId = args.id;
      if (context.user?.id !== userId) {
        throw new Error("Vous n'avez pas la permission de supprimer cet utilisateur.");
      }

      await prisma.user.delete({ where: { id: userId } });
      return { message: "L'utilisateur a été supprimé avec succès." };
    },
  }
};
