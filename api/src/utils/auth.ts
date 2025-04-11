import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';

export function getUserFromToken(token: string) {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    }
    return null;
  } catch (error) {
    return null;
  }
}
