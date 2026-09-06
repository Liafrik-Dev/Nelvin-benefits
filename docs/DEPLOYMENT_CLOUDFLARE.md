# Déploiement Cloudflare — Nelvin Benefits

## Cible

**Cloudflare Pages** — le build Vite produit un site statique (`dist/`), aucune fonction serveur n'est requise pour le frontend actuel().

> Note: un déploiement Worker/Functions (remplacement du backend Base44** serait une étape ultérieure; ne pas confondre avec l'hébergement du frontend.



## Configuration Pages

| Réglage | Valeur |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20+` |
| Install command | `npm install` |

## Variables d'environnement côté Pages

Dans le dashboard Cloudflare Pages → **Settings → Environment variables**:

| Variable | Valeur d'exemple | Notes |
|---|---|---|
| `VITE_BASE44_APP_ID` | (id Base44 de production) | Requise à la volée Base44 |
| `VITE_BASE44_FUNCTIONS_VERSION` | (vide = défaut) | Optionnelle |
| `VITE_BASE44_APP_BASE_URL` | `https://…base44…` | Base du runtime Base44 |
| `VITE_API_BASE_URL` | (ex: `/` same-origin) | Optionnelle |

**Ne mettez jamais de secrets dans l'UI** — si des secrets serveur sont un jour nécessaires, utilisez Cloudflare Workers/Functions + `cf bindings` (secrets) et appelez-les depuis le frontend uniquement par des routes API du worker. Préfixe `VITE_` = exposé au navigateur → tout ce qui est `VITE_` est public par conception.



## _redirects (SPA routing_

Cloudflare Pages sert `dist/`; pour le routing client React Router, créez un fichier `public/_redirects`:

```
/*  /index.html  200
```

## Caching

Recommandations sur `_headers`:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*
  Cache-Control: public, max-age=0, must-revalidate
```

Les hashes Vite rendent les assets immutables; le HTML est revalidé à chaque visite.Cloudflare gère la compression automatiquement (Brotli**.



## Pipeline Git→Pages

```bash
# local
npm install
npm run build

# preview local du build
npm run preview

# push (cette repo vise main par défaut:
git push origin main
```

Puis dans Pages: **Create project → connecter le repo GitHub → branche `main` → réglages ci-dessus → Deploy**.



## Vérification post-déploiement

1. Status de déploiement **Success**.
2. Tester les routes clés: `/`, `/login`, `/offers`, `/dashboard` (avec session**, `/admin/**.
3. Tester le fallback 404: une URL inconnue doit rendre la page `PageNotFound` (grâce au _redirects**.
4. Vérifier que les appels Base44 aboutissent en production (les variables d'env sont en place**.
5. Forcer un re-test des langues (fr/de/es/sw/ig/yo** après déploiement.



## Limitations connues

- Sans Base44 en production, les pages fonctionnent mais avec des données vides (fallback dev seulement**. Le déploiement doit impérativement renseigner les variables Base44.
 sinon l'UI ne montre pas de données réelles.

- CORS: les appels Base44 doivent autoriser l'origine Cloudflare Pages concernée.
.

## Etapes futures possibles (hors scope

- Migrer le backend vers Cloudflare Workers (Hono/Fresh…) + D1/Postgres/KV/R2 tout en gardant `src/services/api/base44Client.js` comme seule interface à réécrire.

- Cloudflare Access pour protéger les routes admin réellement.

- Rate limiting et cache API côté Worker.Cloudflare Analytics/RUM pour la surveillance.