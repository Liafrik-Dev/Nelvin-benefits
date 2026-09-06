# Architecture — Nelvin Benefits

## Vue d'ensemble

Application **SPA Vite + React 19** hébergée statiquement. Le backend et l'authentification sont assurés par la plateforme **Base44** (base de données + auth + intégraciones), consommée uniquement à travers l'abstraction `src/services/api/base44Client.js`.

## Arborescence src

```
src/
├── app/
│   ├── config/          → configuration globale (paramètres d'app, params Base44
│   ├── providers/       → providers React (AuthProvider, QueryProvider, LanguageProvider, etc.)
│   └── router/          → composants du routeur(ProtectedRoute, RoleRoute, etc.)
├── components/
│   ├── ui/              → primitives UI (button, card, dialog, etc. — style shadcn)
│   ├── layout/          → layouts globaux(Header, Footer, Sidebar…) 
│   ├── shared/          → composants partagés métier
│   ├── auth/            → formulaires/login/signup, guards
│   ├── nelvin/         → sections marketing de la homepage (Hero, HowItWorks, FAQ, Footer, FeaturedDeals, PricingSection, Testimonials…)
│   ├── admin/          → composants admin(data tables, modals, statuts…)
│   ├── corporate/      → composants corporate(dashboards, onboarding…)
│   └── vendor/         → composants vendor(onboarding, formulaires…)
├── pages/
│   ├── public/          → Home, CategoryOffers, CountryOffers, AllOffers, OfferDetail, VendorOnboarding, ChoosePlan, Corporate, 404
│   ├── auth/           → Login, Register, ForgotPassword, ResetPassword
│   ├── subscriber/     → Dashboard, Checkout, Benefits, MyOffers, Profile
│   ├── corporate/      → CorporateSignup, CorporateDashboard
│   ├── vendor/         → (onboarding/offres vendor)
│   └── admin/          → AdminHome + 16 modules admin
├── features/           → logique métier par domaine (auth, users, companies, offers, memberships, payments, redemptions, reviews, notifications, support, analytics)
├── hooks/              → hooks React réutilisables
├── services/
│   ├── api/            → base44Client (SEUL point d'accès Base44)
│   ├── auth/          → logique d'authentification
│   ├── payments/      → logique de paiement
│   └── storage/       → persistance locale
├── lib/
│   ├── locales/       → 7 fichiers de langue (en,fr,de,es,sw,ig,yo — 190 clés chacun)
│   ├── i18n.jsx      → système i18n léger (useLanguage, t(,, LANGUAGES(
│   ├── constants/     → constantes globales
│   ├── validation/    → schémas/validations
│   ├── utils/         → helpers
│   ├── plansData.js   → données des plans d'abonnement
│   ├── query-client.js→ configuration TanStack Query
│   └── app-params.js → bootstrap des paramètres Base44
├── styles/            → tokens design (typographie, couleurs, spacing, radii, shadows, transitions, breakpoints)
├── assets/           → ressources statiques
├── contexts/         → contextes React (AuthContext, LanguageContext, etc.)
├── entities/         → définitions d'entités/adapters Base44
└── types/            → types partagés
```

## Routage

Routes publiques:

- `/`, `/category/:categorySlug`, `/country/:countrySlug`, `/offers`, `/offer/:offerId`, `/partner`, `/choose-plan`, `/corporate`
- `/login`, `/register`, `/forgot-password`, `/reset-password`

Routes protégées:

- **Subscriber**: `/dashboard`, `/checkout`, `/benefits`, `/my-offers`, `/profile`
- **Corporate**: `/corporate-signup`, `/corporate-dashboard`
- **Admin**: `/admin` + `/admin/users`, `/admin/companies`, `/admin/businesses`, `/admin/pending-businesses`, `/admin/offers`, `/admin/pending-offers`, `/admin/categories`, `/admin/countries`, `/admin/membership-plans`, `/admin/reviews`, `/admin/notifications`, `/admin/payments`, `/admin/support`, `/admin/analytics`, `/admin/settings`, `/admin/roles`, `/admin/audit-logs`, `/admin/backups`
- Fallback: `*` → PageNotFound (404)

Les protections sont appliquées côté frontend (routes par rôle**; la sécurité réelle doit toujours être enforceée côté backend/Base44.

## Flux de données

1. Legacy(Base44 host): le runtime injecte `globalThis.__B44_DB__` avant le boot du bundle.
2. `src/lib/app-params.js` lit/bootstrap les paramètres Base44.
3. Tous les composants utilisent `import { db } from "@/services/api/base44Client"` (jamais la globale directement**.
4. Hors Base44, un fallback read-only en mémoire rend l'UI renderable.

## i18n

- `src/lib/i18n.jsx` expose `LanguageProvider`, `useLanguage()` (retourne `t`, `lang`, `setLang`**, `LANGUAGES`.
- 7 locales dans `src/lib/locales/*.js` (190 clés chacune`, exportant nommément(`en`, `fr`,…**.
- Les clés sont plates(`nav.home`, `home.hero.badge`, `faq.q1.a1`, `footer.rights`, `deals.tab.restaurants`…**.
- Le choix de langue est persistant(storage local**.

## Décisions remarquables

- **Seam Base44 unique**: `src/services/api/base44Client.js` — tout le frontend passe par `db`; future migration Supabase/PostgreSQL = remplacer ce fichier uniquement.

- **Contenu données non-i18n volontairement**: les noms de catégories servent de clés de filtrage pour les offres Base44 (`o.category === activeName`); les traduire casserait le filtrage. Le contenu administratif/métier (offres, plans) reste dans sa langue source.

- **Design tokens centralisés**: pas de valeurs arbitraires répétées; typographie, couleurs, espacements, radii, ombres, transitions et breakpoints sont centralisés dans `src/styles/` et la config Tailwind.Cette structure évolue naturellement; aucune migration forcée n'est requise car le projet a déjà été organisé selon ce modèle.