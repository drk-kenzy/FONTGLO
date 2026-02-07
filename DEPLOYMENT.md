# Guide de Déploiement

Ce guide explique comment déployer l'application Glose Bookshelf.

## Déploiement sur Vercel (Recommandé)

Vercel est la plateforme recommandée pour déployer des applications Next.js.

### Méthode 1 : Via l'interface Vercel

1. **Créer un compte Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Inscrivez-vous avec GitHub, GitLab ou Bitbucket

2. **Importer le projet**
   - Cliquez sur "Add New Project"
   - Importez votre repository Git
   - Vercel détectera automatiquement Next.js

3. **Configuration**
   - Framework Preset: Next.js (détecté automatiquement)
   - Build Command: `npm run build` (par défaut)
   - Output Directory: `.next` (par défaut)
   - Install Command: `npm install` (par défaut)

4. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez que le build se termine
   - Votre site sera disponible sur `*.vercel.app`

### Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## Déploiement sur Netlify

1. **Connecter le repository**
   - Allez sur [netlify.com](https://netlify.com)
   - New site from Git
   - Connectez votre repository

2. **Configuration du build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Variables d'environnement** (si nécessaire)
   - Ajoutez vos variables dans Site settings > Environment variables

## Déploiement Manuel

### Build local

```bash
# Installer les dépendances
npm install

# Créer le build de production
npm run build

# Démarrer le serveur
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

### Avec Docker (optionnel)

Créez un `Dockerfile` :

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Ensuite :

```bash
docker build -t glose-bookshelf .
docker run -p 3000:3000 glose-bookshelf
```

## Variables d'Environnement

L'application n'a pas besoin de variables d'environnement pour fonctionner car elle utilise l'API publique Glose.

Si vous souhaitez ajouter des configurations :

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=https://api.glose.com
NEXT_PUBLIC_USER_ID=5a8411b53ed02c04187ff02a
```

## Vérification Post-Déploiement

Après le déploiement, vérifiez :

1. ✅ La page d'accueil affiche les étagères
2. ✅ Le clic sur une étagère affiche les livres
3. ✅ La recherche fonctionne
4. ✅ La pagination fonctionne
5. ✅ Les images se chargent correctement
6. ✅ Le site est responsive sur mobile

## Optimisations de Production

Le projet est déjà optimisé avec :

- ✅ Images Next.js optimisées
- ✅ Code splitting automatique
- ✅ Compression gzip/brotli
- ✅ Cache des assets statiques
- ✅ Prefetching des routes

## Support

Pour toute question sur le déploiement :
- Documentation Next.js : [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
