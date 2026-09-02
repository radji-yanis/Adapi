# Adapi

Adapi est une API REST construite avec Node.js, Express et PostgreSQL, qui expose les données de La Remise (objets, dépôts, personnes, catégories). Elle sert de socle backend au projet AdaRemise, qui sera développé en équipe à partir de la semaine 15.

## Installation

1. Cloner le dépôt
\`\`\`bash
git clone <url-du-depot>
cd Adapi
\`\`\`

2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`


## Variables d'environnement

Copie le fichier `.env.example` en `.env` :
\`\`\`bash
cp .env.example .env
\`\`\`
Puis remplis `.env` avec les valeurs suivantes :

- `DB_HOST` : l'adresse où PostgreSQL écoute (localhost si tu   développes en local)
- `DB_PORT` : le port sur lequel PostgreSQL écoute (5432 par défaut)
- `POSTGRES_USER` : le nom d'utilisateur de la base de données
- `POSTGRES_PASSWORD` : le mot de passe de la base de données
- `POSTGRES_DB` : le nom de la base de données
- `PORT` : le port sur lequel ton serveur Express écoute. Différent de `DB_PORT`, qui concerne PostgreSQL.


## Lancer le projet

1. Démarre le conteneur PostgreSQL
\`\`\`bash
docker compose up -d
\`\`\`

2. Crée les tables et les types (enums) dans la base ( migration_up.sql)
\`\`\`bash
cat db/migration_up.sql | docker exec -i adapi-postgres psql -U adapi -d adapi_db
\`\`\`

3. Importe les données de test (seed.sql)
\`\`\`bash
cat db/seed.sql | docker exec -i adapi-postgres psql -U adapi -d adapi_db
\`\`\`

4. Démarre le serveur Express
\`\`\`bash
npm run dev
\`\`\`

## Routes disponibles

Toutes les routes sont préfixées par `/api`.

### Catégories

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/categories` | Liste toutes les catégories (id, libelle) |

### Objets

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/objets` | Liste des objets, avec le libellé de leur catégorie. Filtres optionnels : `?statut=` et `?categorie_id=` |
| GET | `/api/objets/:id` | Un objet précis, avec sa catégorie, son dépôt et le nom de sa donatrice |
| PATCH | `/api/objets/:id/statut` | Modifie le statut d'un objet (`arrive`, `en_reparation`, `en_rayon`, `vendu`, `recycle`). Body : `statut`, `prix` (optionnel) |

### Personnes

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/personnes` | Crée une donatrice. Body : `nom`, `prenom`, `telephone` (optionnel), `adherente` (optionnel) |

### Dépôts

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/depots/:id` | Un dépôt, sa donatrice, et la liste des objets qu'il contient |
| POST | `/api/depots` | Enregistre un dépôt. Body : `personne_id`, `date_depot`, `type` (`boutique` ou `domicile`) |
| POST | `/api/depots/:id/objets` | Ajoute un objet au dépôt. Body : `libelle`, `poids_kg`, `etat_arrivee` (`bon_etat`, `a_reparer`, `hors_service`), `categorie_id` |

### Stats

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/stats` | Trois indicateurs : nombre d'objets par statut, poids total reçu, poids détourné de la déchetterie |


## Tester l'API

Les requêtes de test sont dans le fichier `requetes/requetes.http`.

Pour les utiliser :
1. Installe l'extension **REST Client** (Huachao Mao) dans VS Code
2. Ouvre `requetes/requetes.http`
3. Clique sur le lien **Send Request** au-dessus de chaque requête
4. La réponse s'affiche dans un panneau à côté (statut HTTP, headers, corps JSON)

Le fichier couvre toutes les routes de l'API, avec des cas de succès et des cas d'erreur .