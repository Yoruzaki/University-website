# Site ENSF Khenchela

Site public (français / arabe / anglais) avec tableau de bord d'administration intégré.

## Démarrage

```bash
npm install
npm run seed   # remplit data/db.json avec le contenu de départ (à ne lancer qu'une fois)
npm run dev
```

Le site est ensuite disponible sur http://localhost:3000, et l'administration sur
http://localhost:3000/admin.

**Identifiants admin par défaut :**
- Adresse : `admin@ensf-khenchela.dz`
- Mot de passe : `ChangeMe123!`

⚠️ Changez ce mot de passe avant toute mise en ligne publique (via `npm run seed`
modifié, ou directement dans `data/db.json`, en remplaçant `passwordHash` par un
hash bcrypt du nouveau mot de passe).

## Comment le site est organisé

- **Chaque page publiée** (`/fr/...`, `/ar/...`, `/en/...`) est une liste ordonnée de
  **sections**, choisies dans une bibliothèque de sections déjà conçues (en-tête
  cinématique, bloc éditorial, chiffres clés, grille éditoriale, etc.).
- **Ajouter une page ou une section se fait entièrement depuis `/admin/pages`**, sans
  toucher au code : créer une page, ajouter une section depuis la liste, remplir les
  champs, publier.
- Le contenu (pages, actualités, programmes, enseignants, documents, menu) est stocké
  dans **`data/db.json`** — un simple fichier JSON, sans base de données externe ni
  dépendance native. C'est un choix délibéré pour que le projet tourne n'importe où
  avec seulement `npm install`.
- `prisma/schema.prisma` documente le schéma équivalent pour une future migration vers
  PostgreSQL (via Prisma), si le site grossit au point d'en avoir besoin. Le code qui
  lit/écrit le contenu est entièrement dans `src/lib/content.ts` — c'est le seul
  fichier à adapter pour changer de stockage, aucune page ni composant n'a besoin
  d'être modifié.

## Structure du code

```
src/
  app/
    [locale]/            pages publiques (fr, ar, en)
      actualites/        liste + détail des actualités
      [...slug]/         rendu générique de toute page créée dans l'admin
    admin/
      login/             connexion
      (protected)/       tableau de bord, pages, actualités, programmes,
                          enseignants, documents, navigation
  components/
    sections/            la bibliothèque de sections (un fichier par type)
    site/                en-tête, pied de page, moteur de rendu des pages
    admin/                formulaires de l'admin
  lib/
    content.ts           API de lecture/écriture du contenu (à adapter pour Postgres)
    db/store.ts          stockage JSON (à remplacer par Prisma si besoin)
    actions.ts           actions serveur appelées par les formulaires de l'admin
    i18n.ts              langues, détection RTL, textes fixes de l'interface
data/db.json             le contenu du site (généré par npm run seed)
```

## Ajouter de nouvelles photos

Les photographies ne sont pas encore intégrées : chaque emplacement affiche un
dégradé forestier avec une légende indiquant quelle photo y mettre (ex. « Photo :
canopée forestière des monts de Khenchela »). Remplacez `PlaceholderImage` par de
vraies images une fois la photothèque réunie — idéalement via `next/image` pointant
vers des fichiers dans `public/photos/`.

## Déploiement

Le projet est un site Next.js standard : il peut être déployé sur Vercel, ou sur tout
hébergeur capable d'exécuter `npm run build` puis `npm run start` (Node.js 20+).
Pensez à définir `AUTH_SECRET` (une chaîne aléatoire longue) dans les variables
d'environnement de production — ne réutilisez pas celle de `.env` fournie pour le
développement.
