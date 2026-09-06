# Nelvin Benefits

**Nelvin Benefits** est une plateforme premium de benefits and lifestyle pour l'Afrique — abonnés, entreprises (corporate), marchands (vendors) et administrateurs. Elle centralise offres, cashback, abonnements, paiements et analytics dans une experience moderne, responsive et multilingue.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 19 + Vite 7 |
| Styling | Tailwind CSS + design tokens centralisés |
| Routing | React Router v7 (routes publiques, subscriber, corporate, vendor, admin) |
| Data / Auth | Base44 SDK ( DB + auth + integraciones) — abstraction dans `src/services/api/base44Client.js` |
| Mise en cache | TanStack Query (`src/lib/query-client.js`) |
| UI kit | Radix UI + lucide-react + shadcn-style components |
| i18n | Système léger maison (`@/lib/i18n`) — **fr, en, de, es, sw, ig, yo** |
| Paiements | Logique existante Base44 (Checkout, plans(Inon modifiée) |
| Hébergement | Cloudflare Pages (build statique Vite |

## Fonctionnalités

- **Abonnés**: decouvrir offres, categories, pays, offres en vedette, redemptions, wallet, profil
- **Corporate**: dashboard, signup, gestion des benefits employés
- **Vendor**: onboardant, gestion offre/marchand
- **Admin**: users, companies, businesses, offres, categories, countries, plans, reviews, notifications, payments, support, analytics, settings, roles, audit-logs, backups

## Installation

Prérequis: Node.20+ et npm.

```bash
npm install
```

## Développement local

Le projet vit normalement dans l'hôte Base44 (le SDK est injectépar la plateforme sur `globalThis.__B44_DB__`). Hors Base44 (simple`vite dev`), un fallback read-only en mémoire garde l'UI renderable sans backend.

```bash
npm run dev
```

Ouvrez http://localhost:5173.

## Variables d'environnement

Copiez `.env.example` vers `.env` et remplissez les valeurs:

| Variable | Rôle |
|---|---|
| `VITE_BASE44_APP_ID` | Identifiant d'application Base44 |
| `VITE_BASE44_FUNCTIONS_VERSION` | Version des fonctions Base44 (optionnelle) |
| `VITE_BASE44_APP_BASE_URL` | URL de base de la plateforme Base44 |
| `VITE_API_BASE_URL` | Optionnelle: URL API si déployé ailleurs que same-origin |

Aucun secret réel ne doit jamais être commité. Voir `docs/ENVIRONMENT.md`.

## Build

```bash
npm run build
# la sortie est dans dist/ (statique, prête pour Cloudflare Pages:
npm run preview
```

## Déploiement Cloudflare

1. Poussez le repository sur GitHub.
2. Créez un projet **Cloudflare Pages** et connectez-le au repository.
3. Configuration du build:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: `20+`

4. Ajoutez les variables d'environnement (VITE_BASE44_* etc.) dans le dashboard Pages.
5. Déployez.

Voir `docs/DEPLOYMENT_CLOUDFLARE.md` pour les details (caching, redirects, Functions optionnelles**.

## Architecture

```
src/
├── app/          → router, providers, config
├── components/   → ui/, layout/, shared/, auth/, nelvin/, admin/, corporate/, vendor/
├── pages/        → public/, auth/, subscriber/, corporate/, vendor/, admin/
├── features/     → logique métier par domaine
├── hooks/        → hooks React réutilisables
├── services/     → api/, auth/, payments/, storage/ (abstraction Base44 centralisée)
├── lib/          → i18n, locales (en/fr/de/es/sw/ig/yo), constants, validation, utils, plansData
├── styles/       → tokens design centralisés
├── assets/       → ressources statiques
└── types/        → types partagés
```

Voir `docs/ARCHITECTURE.md`.

## Internationalisation

7 langues prêtes à l'emploi: **Anglais, Français, Allemand, Espagnol, Swahili, Igbo, Yoruba**. Le sélecteur de langue est dans la barre de navigation et le choix est persistant.

 Le contenu UI (homepage, nav, footer, formulaires principaux** est traduit; le contenu métier issu de Base44 (offres, plans de données** restéint dans sa langue source pour préserver le filtrage des données. Voir `docs/TECHNICAL_DEBT.md`.

## Dépendances Base44

Le frontend ne dépend pas directement du runtime Base44**: tout passe par `src/services/api/base44Client.js` (singleton `db`**), ce qui permet de remplacer Base44 plus tard par Supabase/PostgreSQL/API propriétaire sans toucher aux pages. Voir `docs/BASE44_DEPENDENCIES.md`.

---

# LIAFRIK

 **Vincent Nogue, CEO de LIAFRIK**. Software and Saas dev

Nous développons une plateforme pensée pour construire et proposer des solutions numériques adaptées aux besoins du marché africain, avec l'ambition de créer une experience moderne, accessible et évolutive.



🌍 **Site officiel :** [liafrik.com](https://liafrik.com?utm_source=chatgpt.com)



---

### 👤 Founder & CEO


**Vincent Nogue**
CEO — LIAFRIK


> Building the future of Africa, one digital solution at a time.



---

© 2026 LIAFRIK — All rights reserved.
