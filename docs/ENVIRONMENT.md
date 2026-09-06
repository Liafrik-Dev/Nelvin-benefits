# Environnement — Nelvin Benefits

## Fichiers

| Fichier | Usage | Commité? |
|---|---|---|
| `.env.example` | Modèle des variables requises/optionnelles | ✅ Oui |
| `.env` | Variables réelles locales | ❌ Non (gitignoré) |
| Dashboard Cloudflare Pages | Variables de production | ❌ Non (jamais dans le repo) |

## Variables

### `VITE_BASE44_APP_ID`

- **Requis** en production au sein de l'hôte Base44.
- Identifiant de l'application Base44 (projet**.
- Exemple: une chaîne UUID long fournie par la console Base44.

### `VITE_BASE44_FUNCTIONS_VERSION`

- **Optionnel**. Laisser vide pour utiliser la version par défaut des fonctions Base44.



### `VITE_BASE44_APP_BASE_URL`

- URL de base de la plateforme Base44 (utilisée par le SDK/bootstrap) pour les appels réseau.
- À adapter selon l'environnement (dev/prod**.

### `VITE_API_BASE_URL`

- **Optionnel**. Utilisé si l'API du back est servie depuis une autre origine que le site lui-même(à terme, via un Worker**. Par défaut: même origine.


## Règles

1. **Toutes les variables préfixées `VITE_` sont publiques.** Ne jamais y placer de secret.
2. Copies locales: `cp .env.example .env`.
3. Ne jamais commiter `.env` ou toute variation (`.env.local`, `.env.production`,… — voir `.gitignore`).
4. Les secrets serveur éventuels (future base de données, clés API,** doivent être gérés par le fournisseur d'hébergement (ex: Cloudflare Workers Secrets**, jamais dans le frontend.
 ou dans le repo.## Sécurité

- Aucune clé API, token, mot de passe, clé privée ou service role key n'est présent dans le dépôt.

- Si un secret apparaît un jour, il doit être révoqué immédiatement, retiré de l'historique Git, et documenté comme variable d'environnement requise.



## Vérification

```bash
# le build doit passer avec le .env.example seul
npm install
npm run build
```