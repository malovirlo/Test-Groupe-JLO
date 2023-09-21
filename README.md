# Projet test JLO

Je devais créer une todoList avec des technologies imposées.
Vite en front, j'ai utilisé React, ApolloClient pour communiquer avec l'API' et Tailwindcss pour le style.
En back, j'ai utilisé Laravel avec GraphQL pour communiquer avec la base et MySQL pour la base de données et Lighthouse pour gerer les requêtes graphql.

## 🚀 Démarrage rapide

Suivez ces étapes pour configurer le projet sur votre machine locale.

### Prérequis

- Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.

### Étapes d'installation

1. **Démarrer les services avec Docker**:
   ```bash
   docker-compose up -d
    ```

2. **Configurer l'environnement**:
   - Accéder au dossier server `server`
   - Créer un fichier `.env` en copiant le fichier `.env.example`
   - Remplir avec les infos suivantes :
   - `DB_CONNECTION=mysql <br>
     DB_HOST=db
     DB_PORT=3306
     DB_DATABASE=JLOtest
     DB_USERNAME=root
     DB_PASSWORD=chienguyen
     `

3. **Générer la clé d'application**:
    ```bash
    php artisan key:generate
    ```

4. **Migrer la base de données**:
    ```bash
    php artisan migrate
    ```

## 🎉 Félicitations!
