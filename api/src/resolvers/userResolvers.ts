import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';

const createToken = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
};

const ITEMS_PER_PAGE = 5;

export const userResolvers = {
  Query: {
    getUser: async (_: unknown, args: { id: number }): Promise<User> => {
      const foundUser = await prisma.user.findUnique({
        where: { id: args.id },
        include: { posts: true },
      });
      if (!foundUser) throw new Error("L'utilisateur n'existe pas");
      return foundUser;
    },
    getUsers: async (_: unknown, args: { page?: number }) => {
      const page = args.page && args.page > 0 ? args.page : 1;
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const [users, total] = await Promise.all([
        prisma.user.findMany({ orderBy: { id: 'desc' }, skip, take: ITEMS_PER_PAGE }),
        prisma.user.count(),
      ]);
      return {
        users,
        total,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        currentPage: page,
      };
    },
  },

  Mutation: {
    signup: async (_: unknown, args: { email: string; password: string; name?: string }): Promise<string> => {
      const email = args.email.toLowerCase();
      if (!args.email || !args.password) throw new Error('Veuillez fournir email et password');
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("L'email est déjà utilisé");
      const hashedPassword = await bcrypt.hash(args.password, SALT_ROUNDS);
      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, name: args.name ?? null },
      });
      return createToken(newUser);
    },

    login: async (_: unknown, args: { email: string; password: string; getToken?: boolean }): Promise<string | Omit<User, 'password'>> => {
      const email = args.email.toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("L'utilisateur n'a pas pu être identifié");
      const isValid = await bcrypt.compare(args.password, user.password);
      if (!isValid) throw new Error("Mot de passe incorrect");
      if (args.getToken) return createToken(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    updateUser: async (_: unknown, args: { id: number; data: { email?: string; name?: string } }, context: { user?: { id: number } }): Promise<User> => {
      if (context.user?.id !== args.id) throw new Error("Non autorisé");
      if (args.data.email) {
        const email = args.data.email.toLowerCase();
        const existingUser = await prisma.user.findFirst({ where: { email, id: { not: args.id } } });
        if (existingUser) throw new Error("L'email est déjà utilisé");
      }
      return await prisma.user.update({
        where: { id: args.id },
        data: { email: args.data.email ? args.data.email.toLowerCase() : undefined, name: args.data.name },
      });
    },

    deleteUser: async (_: unknown, args: { id: number }, context: { user?: { id: number } }): Promise<{ message: string }> => {
      if (context.user?.id !== args.id) throw new Error("Non autorisé");
      await prisma.user.delete({ where: { id: args.id } });
      return { message: "Utilisateur supprimé avec succès" };
    },
  },
};
