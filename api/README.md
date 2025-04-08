# Réseau Social - Backend

Ce projet constitue la partie backend d'un réseau social développé en Node.js et TypeScript. Il utilise Apollo Server pour exposer une API GraphQL, Prisma pour la gestion de la base de données PostgreSQL, et JWT pour l'authentification des utilisateurs.

## Prérequis

- **Node.js** (version 14+ recommandée)
- **PostgreSQL** (accessible via DBeaver ou un autre client SQL)
- **Git** pour la gestion du code source

## Installation

1. **Cloner le dépôt :**
   ```bash
   git clone <URL_DU_DEPOT>
   cd api

2. Installer les dépendances :

npm install

3. Configurer l'environnement :
Créez un fichier .env à la racine du projet avec le contenu suivant (adapté à votre configuration) :
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>?schema=public"
JWT_SECRET="votre_clé_secrète"


Prisma

Prisma est utilisé pour gérer la base de données. Le schéma est défini dans prisma/schema.prisma.

Pour appliquer la migration et générer le client Prisma, exécutez :
npx prisma migrate dev --name init

Cette commande va :

    Créer une migration
    Appliquer les migrations à votre base de données
    Générer le Prisma Client dans node_modules/@prisma/client
    
Vous pouvez vérifier que vos tables (User, Post, Comment, Like) ont été créées en vous connectant à votre base de données via DBeaver.
