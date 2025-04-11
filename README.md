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







# Réseau Social - Frontend
Ce répertoire contient l'application front-end du réseau social, développée en Vue.js, utilisant Apollo Client et Vue Router pour communiquer avec l'API GraphQL du back-end.

## Prérequis
Node.js (v14 ou supérieur recommandé)

npm

## Installation
Cloner le dépôt :

bash
Copier
git clone <URL_DU_DEPOT>
Naviguer dans le dossier du front-end :

bash
Copier
cd client
Installer les dépendances :

bash
Copier
npm install
Configuration
La configuration d'Apollo Client se trouve dans src/apollo/apolloClient.ts.
Si nécessaire, modifiez l'URL de l'API GraphQL (par défaut http://localhost:4000/graphql).

Lancement de l'application
Pour démarrer l'application en mode développement, exécutez :

bash
Copier
npm run dev
L'application sera accessible à l'URL indiquée dans le terminal (souvent http://localhost:5173 ou 5174).


## Fonctionnalités
Authentification : Permet l'inscription, la connexion et la déconnexion (le bouton Logout apparaît sur Home).

Navigation : Utilisation de Vue Router pour passer entre les pages Login, Signup et Home.

Article: Chaque utilsateur peut rajouter supprimer modifier un article.

Commentaire:Chaque utilsateur peut rajouter supprimer modifier un article.

Liker: Chaque utilisateur peut liker et disliker un article.

Communication avec l'API : Apollo Client gère les requêtes et mutations GraphQL.

État d'authentification réactif : Le token est stocké dans le localStorage et l'interface se met à jour automatiquement en fonction de l'état.



