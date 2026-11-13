# Remise et exploitation du site ENSF

## Installation sur un serveur

Cette version utilise un serveur Node.js unique et un disque persistant. Le contenu et les photos téléversées sont enregistrés dans le dossier data. Une plateforme sans disque persistant perdrait les modifications lors des redéploiements. Pour plusieurs serveurs, migrer le stockage vers une base de données et un stockage d’objets partagés avant la mise en service.

1. Installer Node.js 22 LTS et exécuter npm ci.
2. Copier le dossier data validé et les photos de public avec le projet. Conserver data entre les déploiements.
3. Définir AUTH_SECRET avec une valeur aléatoire privée et AUTH_URL avec le domaine HTTPS officiel. Garder les secrets hors du dépôt.
4. En local, ouvrir /admin/account et remplacer le mot de passe de démonstration. Le mot de passe ChangeMe123! est refusé en production. Un changement de mot de passe invalide les sessions précédentes.
5. Exécuter npm run build, puis npm run start derrière un serveur HTTPS. Configurer le redémarrage automatique du processus et la journalisation des erreurs.
6. Vérifier les liens institutionnels, coordonnées, traductions et contenus avec l’établissement. Les données préremplies sont des exemples.

La limitation des tentatives de connexion est conservée en mémoire par processus. Pour le serveur public, compléter avec une limitation au niveau du proxy. Les utilisateurs SUPER_ADMIN et EDITOR peuvent modifier le contenu. CONTRIBUTOR ne dispose pas de droits d’écriture dans cette version.

## Travail quotidien

Depuis le tableau de bord, choisir Actualité, Événement, Annonce importante ou Opportunité. Les actualités proposent un brouillon, une publication, une priorité sur l’accueil, des traductions et deux présentations.

Pour les actualités, ajouter jusqu’à cinq photos JPG, PNG ou WebP de 8 Mo maximum chacune. La première est la couverture. Le bouton Mettre en couverture permet de choisir une autre photo. Les images sont réencodées en WebP et redimensionnées pour le site. Les autres photos apparaissent dans une galerie agrandissable au clavier.

Les fichiers téléversés ont une URL publique. Utiliser uniquement des photos destinées à être diffusées. Retirer une photo d’un article conserve le fichier sur le serveur.

## Sauvegardes et restauration

Exécuter npm run backup. La commande crée un dossier daté dans backups avec le contenu complet de data, y compris les photos. On peut fournir un dossier de destination avec npm run backup -- chemin-du-dossier. Le dossier contient les comptes et leurs empreintes de mots de passe, il doit être accessible uniquement aux responsables autorisés.

Planifier une sauvegarde quotidienne au niveau du serveur et copier les sauvegardes vers un emplacement séparé. La copie data/db.json.previous protège uniquement l’enregistrement précédent, elle complète les sauvegardes datées.

Pour restaurer, arrêter le serveur, conserver une copie du dossier data actuel, remplacer data par celui d’une sauvegarde vérifiée puis redémarrer. Vérifier les pages, la connexion et les photos.

Les enregistrements sont protégés par un verrou et remplacés atomiquement. Si un arrêt brutal laisse data/db.json.lock, arrêter tous les processus du site, sauvegarder data, vérifier db.json puis retirer uniquement ce verrou avant de redémarrer. Une base JSON illisible déclenche une erreur au lieu d’être remplacée par une base vide.

La commande seed refuse de remplacer une base existante. setup:university ajoute les rubriques à une base existante. Sauvegarder avant toute opération de maintenance.

## Vérifications avant ouverture

- Domaine et certificat HTTPS fonctionnels.
- Mot de passe personnel, secret de session propre au serveur, sauvegarde externe planifiée et restauration testée.
- Contenus, dates, liens E-learning, bibliothèque, DSpace et plateformes validés par l’établissement.
- Connexion, brouillon, publication, modification, cinq photos et consultation sur téléphone vérifiés sur le serveur final.
- Contrôle éditorial des informations légales, de la confidentialité et des droits de diffusion des photos par l’établissement.

## Vérifications de développement

La compilation de production et les vérifications TypeScript sont exécutées dans ce projet. Les vérifications locales couvrent la connexion, le téléversement multiple, le choix de couverture et l’enregistrement d’un brouillon. Un contrôle du stockage couvre les identifiants, les modifications, les doublons, les suppressions concurrentes et les données illisibles. Ces contrôles doivent être complétés par une recette sur l’hébergement final.
