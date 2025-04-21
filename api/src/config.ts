import 'dotenv/config';

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3800,
  jwtSecret: process.env.JWT_SECRET ?? 'default_secret',
  databaseURL: process.env.DATABASE_URL, 
};
