# 🚀 Démarrage Rapide

## Installation en 3 étapes

### 1. Installer les dépendances

```bash
cd glose-bookshelf
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

### 3. Ouvrir dans le navigateur

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## Commandes Utiles

```bash
npm run dev          # Démarrer en développement (port 3000)
npm run build        # Construire pour production
npm start            # Démarrer en production
npm test             # Lancer les tests
npm run test:watch   # Tests en mode watch
npm run lint         # Vérifier le code
```

---

## Structure du Projet

```
glose-bookshelf/
├── app/              # Pages Next.js
│   ├── page.tsx      # 🏠 Page d'accueil (liste étagères)
│   └── shelf/[id]/   # 📚 Page détail étagère
├── components/       # Composants réutilisables
├── lib/             # API client et utilitaires
└── __tests__/       # Tests
```

---

## Navigation

1. **Page d'accueil** → Liste de toutes les étagères
2. **Cliquer sur une étagère** → Voir les livres de l'étagère
3. **Utiliser la recherche** → Filtrer par titre/auteur
4. **Pagination** → Naviguer entre les pages

---

## Points d'Attention

✅ **Tout fonctionne out-of-the-box** - Aucune configuration requise  
✅ **Pas de .env nécessaire** - L'API Glose est publique  
✅ **Tests inclus** - Lancez `npm test` pour vérifier  
✅ **Production ready** - Prêt pour déploiement Vercel/Netlify

---

## Besoin d'aide ?

- 📖 Lisez le [README.md](./README.md) complet
- 🚀 Guide de [déploiement](./DEPLOYMENT.md)
- 💡 Idées d'[améliorations](./IMPROVEMENTS.md)

---

**Bon développement ! 🎉**
