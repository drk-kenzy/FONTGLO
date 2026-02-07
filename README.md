# 📚 Bibliothèque Glose

Une application Next.js élégante pour explorer et gérer vos collections de livres via l'API Glose.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Fonctionnalités

### Fonctionnalités Principales
- ✅ **Liste des étagères** - Affichage de toutes vos étagères de livres
- ✅ **Grille de livres** - Vue en grille élégante des livres par étagère
- ✅ **Pagination** - Navigation fluide entre les pages
- ✅ **Recherche** - Recherche par titre ou auteur
- ✅ **Informations détaillées** - Affichage de la couverture, titre, auteur(s), prix et note moyenne

### Fonctionnalités Bonus Implémentées
- ⭐ **Recherche avancée** - Recherche en temps réel sur les livres
- ⭐ **Tests complets** - Tests unitaires avec Jest et React Testing Library
- ⭐ **Design élégant** - Interface utilisateur raffinée avec animations Framer Motion
- ⭐ **Affichage des notes** - Notes moyennes avec icône étoile
- ⭐ **Performance optimisée** - Chargement lazy des images, cache API
- ⭐ **Architecture propre** - Code organisé et maintenable

## 🎨 Design

L'application utilise une esthétique **éditoriale/magazine minimaliste** avec :
- **Typographie raffinée** : Playfair Display (titres) et Crimson Pro (corps)
- **Palette élégante** : Tons crème et sépia pour une ambiance chaleureuse de bibliothèque
- **Animations subtiles** : Transitions fluides avec Framer Motion
- **Design responsive** : Adapté à tous les écrans

## 🏗️ Architecture

```
glose-bookshelf/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil (liste des étagères)
│   ├── shelf/[id]/        # Page détail d'une étagère
│   └── globals.css        # Styles globaux
├── components/            # Composants React réutilisables
│   ├── BookCard.tsx       # Carte de livre
│   ├── ShelfCard.tsx      # Carte d'étagère
│   ├── Pagination.tsx     # Composant de pagination
│   ├── SearchBar.tsx      # Barre de recherche
│   ├── Loading.tsx        # États de chargement
│   └── ErrorMessage.tsx   # Gestion des erreurs
├── lib/                   # Logique métier
│   ├── api.ts            # Client API Glose
│   └── utils.ts          # Fonctions utilitaires
├── types/                 # Types TypeScript
│   └── api.ts            # Types pour l'API
└── __tests__/            # Tests unitaires
    ├── api.test.ts
    ├── utils.test.ts
    └── components.test.tsx
```

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le projet
cd glose-bookshelf

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Commandes disponibles

```bash
npm run dev        # Lancer en mode développement
npm run build      # Construire pour la production
npm run start      # Lancer en mode production
npm run lint       # Linter le code
npm run test       # Lancer les tests
npm run test:watch # Lancer les tests en mode watch
npm run test:coverage # Générer le rapport de couverture
```

## 🧪 Tests

Le projet inclut des tests complets :

- **Tests unitaires** pour les fonctions utilitaires
- **Tests unitaires** pour le client API
- **Tests de composants** avec React Testing Library

```bash
# Lancer tous les tests
npm test

# Avec couverture
npm run test:coverage
```

## 📡 API Glose

L'application utilise l'API Glose avec les endpoints suivants :

- `GET /users/{userId}/shelves` - Liste des étagères
- `GET /shelves/{shelfId}/forms` - Liste des livres d'une étagère
- `GET /forms/{formId}` - Détails d'un livre

**URL de base** : `https://api.glose.com`  
**User ID** : `5a8411b53ed02c04187ff02a`

## 🔧 Technologies Utilisées

### Core
- **Next.js 14** - Framework React avec App Router
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique

### Styling
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides

### Data Fetching
- **SWR** - Hook pour le fetching de données (configuré)
- **Native Fetch API** - Requêtes HTTP

### Testing
- **Jest** - Framework de test
- **React Testing Library** - Tests de composants
- **@testing-library/jest-dom** - Matchers personnalisés

## 🎯 Fonctionnalités Clés

### Gestion des États
- Chargement avec skeleton screens élégants
- Gestion d'erreur avec retry
- États vides informatifs

### Performance
- Images optimisées avec Next.js Image
- Lazy loading automatique
- Cache API (1 heure)
- Pagination côté serveur

### UX/UI
- Design responsive mobile-first
- Animations et transitions fluides
- Feedback visuel sur toutes les interactions
- Accessibilité (ARIA labels, navigation clavier)

## 📝 Choix Techniques

### Pourquoi Next.js App Router ?
- SSR et SSG pour de meilleures performances
- Routing simple et intuitif
- Optimisations d'images automatiques
- Support TypeScript excellent

### Pourquoi Tailwind CSS ?
- Développement rapide
- Design system cohérent
- Purge CSS automatique
- Personnalisation facile

### Pourquoi Framer Motion ?
- Animations déclaratives
- Performance optimisée
- API intuitive
- Animations de liste facilitées

## 🌟 Points Forts

1. **Code propre et maintenable** - Architecture claire, composants réutilisables
2. **TypeScript strict** - Typage complet pour éviter les erreurs
3. **Tests complets** - Couverture des cas importants
4. **Design unique** - Esthétique distinctive, pas de template générique
5. **Performance** - Optimisations d'images, cache, pagination
6. **UX soignée** - Feedback utilisateur, gestion d'erreurs, animations

## 📄 Licence

Ce projet est un test technique et est fourni à titre d'exemple.

## 👤 Auteur

Créé avec ❤️ pour le test technique Glose
