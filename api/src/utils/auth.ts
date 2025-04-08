import { verifyToken, MyJwtPayload } from './jwt';

export const getUserFromToken = (token: string): MyJwtPayload | null => {
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};
