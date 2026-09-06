# Dépendances Base44 — Nelvin Benefits

## État actuel

Nelvin Benefits est hébergé sur la plateforme **Base44** et l'en consomme pour **la base de données**, **l'authentification** et **les intégraciones** (uploads…). Le but est de pouvoir remplacer Base44 plus tard par Supabase/PostgreSQL/une API propriétaire **sans toucher aux pages**.

## Point de contact unique

Tout l'accès passe par:

```
src/services/api/base44Client.js
```

Ce module:

- Lit le SDK riverain de la plateforme sur `globalThis.__B44_DB__` (injectépar le runtime Base44 avant le boot? non — via `src/lib/app-params.js`)
- Exporte un singleton `db` avec la même surface:

```js
{
  auth: { isAuthenticated(), me(), … },
  entities: { <Entité>: { filter(), get(), create(), update(), delete() } },
  integrations: { Core: { UploadFile(), … } },
}
```

- **Fournit un fallback read-only en mémoire** lorsque le projet est exécuté hors de l'hôte Base44 (`vite dev`/`preview`) pour que l'UI reste renderable.

.

**Règle d'or**: aucun composant, page, hook ni feature ne doit importer `globalThis.__B44_DB__` directement. Importer `db` depuis `@/services/api/base44Client`.

## Surface utilisée

| Domaine | Module(s) d'import | Utilisation |
|---|---|---|
| Auth | `src/services/auth/` | login, register, session, guards |
| Entités | `db.entities.<Nom>` via `src/entities/` | users, companies, businesses, offers, categories, countries, membership_plans, redemptions, reviews, notifications, payments, support_tickets, audit_logs, backups et autres |
| Fichiers | `db.integrations.Core.UploadFile` | uploads (admin/vendor) |
| Paramètres d'app | `src/lib/app-params.js` | identifiants Base44 (app id, base URL, fonctions version) |

Les imports concrets se trouvent principalement dans `src/services/`, `src/features/`, `src/entities/` et quelques composants (ex: `FeaturedDeals.jsx` consomme `db.entities.Offer.filter(...)`**).

## Historique de migration (cadeaux pour le futur remplacement**

1. **Créer une couche repository**: `src/services/api/*` (offersApi, usersApi, etc.** qui encapsulent les appels `db.entities…` par domaine. Les composants ne devraient importer QUE ces APIs, pas `db` directement.
2. **Adapter `src/entities/`**: mapper les entités Base44 vers des types locaux(** ne pas propager les noms Base44 camelCase dans les composants**.
3. **Auth**: `src/services/auth/` doit rester la seule surface d'authentification consommée par les guards/routes.
4. **Fallback**: remplacer le fallback en mémoire par un adapter Supabase/PostgreSQL (mêmes méthodes `filter/create/update/delete`).

## Risques

- **Couplage résiduel**: certains composants (ex: `FeaturedDeals.jsx`) importent encore `db` directement — à migrer vers un `offersApi`.
- **Fallback en mémoire**: utile au dev mais renvoie des données vides; ne pas l'utiliser pour valider le métier.
.
- **Stockage de fichiers**: `UploadFile` est un point de friction si l'on quitte Base44; prévoir un bucket S3/R2à la place.



## Résumé

| Item | Statut |
|---|---|
| Abstraction centralisée | ✅ `src/services/api/base44Client.js` |
| Interdiction d'accès direct à la globale | ✅ (documentée dans le module) |
| Migration API par domaine | 🟡 À compléter |
| Composants restants import de `db` | 🟡 (`FeaturedDeals.jsx` etc.) |
| Fallback dev | ✅ read-only en mémoire |
| Secrets | ✅ aucun secret base44 dans le repo; seulement des variables documentées |