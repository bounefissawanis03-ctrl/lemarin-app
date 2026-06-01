# Le Marin Hôtel

Application web pour Le Marin Hôtel avec système de réservation, avis clients et espace administrateur.

## Exécution locale

1. Copier le fichier d'environnement :
   ```bash
   cp .env.example .env
   ```
2. Définir une valeur forte pour `JWT_SECRET`.
3. Installer les dépendances :
   ```bash
   npm ci
   ```
4. Démarrer le serveur :
   ```bash
   npm start
   ```
5. Ouvrir `http://localhost:3000`

## Admin

- Page admin : `/admin.html`
- Créer un compte admin :
  ```bash
  node create_admin.js --email admin@exemple.com --password MonMotDePasseFort123
  ```

## Déploiement

Le projet est prêt pour Render et Docker.

### Render
- Le fichier `render.yaml` est inclus.
- Le démarrage se fait avec `npm start`.
- Variables d'environnement requises :
  - `JWT_SECRET`
  - `PORT=3000`
  - `DATABASE_PATH=./database/lemarin.db`

### Docker
- Construire l'image :
  ```bash
  npm run docker-build
  ```
- Lancer le conteneur :
  ```bash
  docker run -d -p 3000:3000 --name le-marin-hotel -e JWT_SECRET=une_valeur_secrete le-marin-hotel
  ```

## CI

Une action GitHub est ajoutée dans `.github/workflows/ci.yml` pour :
- installer les dépendances
- lancer le build
- exécuter les tests
