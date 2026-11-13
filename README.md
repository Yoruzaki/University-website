# Site ENSF Khenchela

## Rubriques universitaires et administration

- `/admin/bulletins/annonces` et `/admin/bulletins/opportunites` : publications FR/AR/EN, catégorie, public concerné, lien, priorité et date limite. Les éléments publiés apparaissent sur l’accueil ; après l’échéance (23h59, heure d’Algérie), ils passent dans les archives publiques. Les brouillons restent privés.

- `/admin/events` : créer et modifier les événements, définir les dates (heure d’Algérie), le lieu, le lien d’inscription, la publication et la priorité sur l’accueil. Les rendez-vous passés restent dans les archives publiques.
- `/admin/services` : configurer E-learning, Bibliothèque, DSpace, EDX, SNDL, PROGRES, messagerie et recherche. Une adresse vide affiche « Lien à venir ». Les services peuvent être masqués et réordonnés.
- `/admin/pages` : modifier les rubriques de vie étudiante, scolarité, admissions et recherche ; ajouter, déplacer ou masquer les sections. Les champs de section sont disponibles en FR/AR/EN (enregistrer avant de changer de langue).
- `/admin/news` : publier les actualités et choisir les articles à mettre à la une.
- L’accueil place les actualités et l’agenda juste après le hero. Les données d’origine restent des exemples à valider par l’établissement.

Les pages et les plateformes sont déjà préparées dans `data/db.json`. Sur une autre base existante, `npm run setup:university` ajoute la structure sans réinitialiser les utilisateurs ou les actualités. Ne relancez pas `seed` sur une base contenant vos modifications.

Pour la connexion locale, définir `AUTH_SECRET` dans un fichier `.env.local` ignoré par Git. Les liens des plateformes et les contenus institutionnels doivent être renseignés et validés avant publication.

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

Avant la mise en ligne, modifiez le mot de passe depuis /admin/account. Le mot de passe de démonstration est refusé en production.

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

## Photos et publication

L’éditeur d’actualités accepte jusqu’à cinq photos JPG, PNG ou WebP, avec une couverture et quatre images de galerie. Il propose un aperçu de carte, deux présentations et des champs FR/AR/EN. Les fichiers sont conservés dans data/news-photos et servis par une route dédiée.

## Déploiement et remise

Utiliser un serveur Node.js 22 avec disque persistant. Le dossier data doit être conservé entre les déploiements. Définir AUTH_SECRET et AUTH_URL pour le domaine HTTPS officiel, puis exécuter npm run build et npm run start.

Exécuter npm run backup pour créer une sauvegarde datée du contenu et des photos. Planifier les sauvegardes externes au niveau du serveur.

Le guide [Remise à l’université](docs/REMISE-UNIVERSITE.md) détaille l’installation, les comptes, les sauvegardes, la restauration et la recette avant ouverture.