# Environnement — Nelvin Benefits

## Fichiers

| Fichier | Usage | Commité? |
|---|---|---|
| `.env.example` | Modèle des variables requises/optionnelles | ✅ Oui |
| `.env` | Variables réelles locales | ❌ Non (gitignoré) |
| Dashboard Cloudflare Pages | Variables de production | ❌ Non (jamais dans le repo) |
| `supabase/migrations/` | Schéma SQL du backend Supabase | ✅ Oui |
| `supabase/seed.sql` | Données de démarrage Supabase | ✅ Oui |

## Backend

La couche données (`src/services/api/dataClient.js`) choisit le backend dans cet ordre :

1. **Supabase** — dès que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont renseignés
   (auth + PostgreSQL + Storage). C'est le backend de production recommandé.
2. **Base44** — SDK hôte injecté sur `globalThis.__B44_DB__` (hôte historique).
3. **Local / démo** — données en mémoire (dev hors hôte), sans persistance.

## Variables

### `VITE_SUPABASE_URL`

- **Requis** pour activer le backend Supabase.
- URL du projet Supabase, ex. `https://yourproject.supabase.co`.

### `VITE_SUPABASE_ANON_KEY`

- **Requis** pour activer le backend Supabase.
- Clé publique/anon (sans risque côté navigateur).

> Une fois les deux variables renseignées, appliquer le schéma :
> `supabase db push` ou coller `supabase/migrations/0001_init.sql` dans le SQL editor,
> puis charger `supabase/seed.sql`. Voir `docs/SUPABASE.md`.

### `VITE_BASE44_APP_ID`

- Identifiant de l'application Base44 (projet), uniquement si on utilise l'hôte Base44.
- Exemple: une chaîne UUID longue fournie par la console Base44.

### `VITE_BASE44_FUNCTIONS_VERSION`

- **Optionnel**. Laisser vide pour utiliser la version par défaut des fonctions Base44.

### `VITE_BASE44_APP_BASE_URL`

- URL de base de la plateforme Base44 (utilisée par le SDK/bootstrap) pour les appels réseau.
- À adapter selon l'environnement (dev/prod).

### `VITE_API_BASE_URL`

- **Optionnel**. Utilisé si l'API du back est servie depuis une autre origine que le site lui-même (à terme, via un Worker). Par défaut: même origine.


## Règles

1. **Toutes les variables préfixées `VITE_` sont publiques.** Ne jamais y placer de secret
   (jamais la `service_role` key Supabase).
2. Copies locales: `cp .env.example .env`.
3. Ne jamais commiter `.env` ou toute variation (`.env.local`, `.env.production`,… — voir `.gitignore`).
4. Les secrets serveur éventuels (service role, clés API) doivent être gérés par le fournisseur
   d'hébergement (Cloudflare Workers Secrets, Supabase Secrets), jamais dans le frontend ou le repo.

## Sécurité

- Aucune clé API, token, mot de passe, clé privée ou service role key n'est présent dans le dépôt.
- Si un secret apparaît un jour, il doit être révoqué immédiatement, retiré de l'historique Git,
  et documenté comme variable d'environnement requise.

## Vérification

```bash
# le build doit passer avec le .env.example seul
npm install
npm run build

# avec un vrai backend Supabase
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run dev
```