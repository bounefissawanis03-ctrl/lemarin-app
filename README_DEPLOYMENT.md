# Déploiement de Le Marin Hôtel

## Hébergement recommandé
Pour obtenir un lien public rapidement, je recommande un service comme Render, Railway ou une plateforme Docker-friendly.

## Préparations locales
1. Copier le fichier d'environnement :
   ```bash
   cp .env.example .env
   ```
2. Générer une valeur secrète sécurisée pour `JWT_SECRET`.
3. Vérifier que le fichier `.env` contient bien :
   ```env
   JWT_SECRET=une_valeur_très_longue_et_random
   PORT=3000
   DATABASE_PATH=./database/lemarin.db
   ```
4. Créer un compte admin localement (avant ou après déploiement) :
   ```bash
   node create_admin.js --email admin@exemple.com --password MonMotDePasseFort123
   ```

## Déploiement avec Render
1. Créer un nouveau service Web et connecter le dépôt GitHub.
2. Branch à déployer : `main` (ou ta branche active).
3. Render détectera le fichier `render.yaml` et l'utilisera automatiquement.
4. Vérifier que les commandes sont :
   - Build command : `npm install`
   - Start command : `npm start`
5. Définir les variables d'environnement sur Render :
   - `JWT_SECRET` (secret)
   - `PORT` = `3000`
   - `DATABASE_PATH` = `./database/lemarin.db`
6. Déployer.

L'application sera disponible à l'adresse fournie par Render, par exemple : `https://nom-de-ton-app.onrender.com`

## Déploiement avec Docker
1. Construire l'image Docker :
   ```bash
   docker build -t le-marin-hotel .
   ```
2. Démarrer le conteneur :
   ```bash
   docker run -d -p 3000:3000 --name le-marin-hotel -e JWT_SECRET=une_valeur_secrete le-marin-hotel
   ```
3. Ouvrir `http://localhost:3000`.

## Page admin
- URL d'administration : `https://ton-site/admin.html`
- Connecte-toi avec l'email et le mot de passe créés.

## Remarques importantes
- `SQLite` est pratique pour un prototype, mais il n'est pas idéal pour les environnements de production à long terme.
- Sur Render, le stockage de fichiers n'est pas permanent après une redeploy. Si tu veux conserver les réservations, il faudra migrer vers une base de données cloud plus stable.
