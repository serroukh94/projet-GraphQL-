import jwt, { JwtPayload as JwtPayloadBase } from 'jsonwebtoken';
import moment from 'moment';
import { config } from '../config';
import { User } from '@prisma/client';

/**
 * Interface personnalisée étendant l'interface JwtPayload de jsonwebtoken.
 */
export interface MyJwtPayload extends JwtPayloadBase {
  sub: string;          // Identifiant de l'utilisateur 
  email: string;
  name: string | null;
  iat: number;
  exp: number;
}

/**
 * Génère un token JWT à partir d'un utilisateur.
 *
 * @param user - L'utilisateur pour lequel générer le token
 * @returns Le token JWT signé
 */
export const createToken = (user: User): string => {
  const payload: MyJwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    name: user.name ?? null,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix(),
  };

  return jwt.sign(payload, config.jwtSecret);
};

/**
 * Vérifie un token JWT et retourne le payload associé.
 *
 * @param token - Le token JWT à vérifier
 * @returns Le payload décodé du token
 * @throws Une erreur si le token est invalide ou expiré
 */
export const verifyToken = (token: string): MyJwtPayload => {
  const decoded = jwt.verify(token, config.jwtSecret);
  if (typeof decoded === 'string') {
    throw new Error('Token invalide : payload sous forme de chaîne de caractères');
  }
  return decoded as MyJwtPayload;
};
