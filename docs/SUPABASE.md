# Supabase — Nelvin Benefits

Nelvin Benefits s'appuie sur **Supabase** comme backend de production :
Auth (email + OAuth Google/Apple), PostgreSQL (RLS) et Storage pour les fichiers.

## 1. Créer le projet

1. Créer un projet sur https://supabase.com.
2. Noter l'**URL du projet** (`https://xxxxxxxx.supabase.co`) et la clé **anon/public**
   (Dashboard → Settings → API).

## 2. Configurer l'application

Créer un fichier `.env` (jamais commité) :

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> Quand ces deux variables sont présentes, `src/services/api/dataClient.js`
> bascule automatiquement sur le backend Supabase (l'ensemble des méthodes
> `db.entities.*`, `db.auth.*` et `db.integrations.*` est mappé sur PostgREST/Auth/Storage).

## 3. Appliquer le schéma

Option A — CLI Supabase :

```bash
supabase link --project-ref xxxxxxxx
supabase db push
```

Le schéma se trouve dans `supabase/migrations/0001_init.sql`.

Option B — SQL Editor du dashboard Supabase :

1. Ouvrir le projet → **SQL Editor** → **New query**.
2. Coller le contenu de `supabase/migrations/0001_init.sql` → **Run**.
3. Coller ensuite `supabase/seed.sql` → **Run**.

## 4. Auth

- **Email/password** : activé par défaut. L'inscription envoie un OTP par email
  (`Confirm email`), que la page `AuthForm` vérifie.
- **Google / Apple** : Dashboard → **Authentication → Providers** → activer
  `Google` (+ `Apple`), renseigner les credentials OAuth, et ajouter l'URL de
  l'application dans **Redirect URLs** (ex. `https://votre-site.com/**`).
- **Password reset** : templates d'email → "Reset password" doit pointer vers
  `{SITE_URL}/reset-password`.

## 5. Storage

La migration crée le bucket **`nelvin-public`** (public) avec une politique
"lecture publique + écriture authentifiée". Les fichiers uploadés via
`db.integrations.Core.UploadFile` y sont stockés.

## 6. Rôles & RLS

Le champ `users.role` contrôle les droits :

| Rôle | Droits |
|---|---|
| `subscriber` / `user` | Parcourir, liker, racheter, profiter des offres |
| `vendor` / `business` / `partner` | Soumettre/enrichir ses offres |
| `hr_admin` | Piloter entreprises/employés/rapports |
| `staff` / `admin` / `founder` | Modération complète (admin) |

Les politiques RLS dans `0001_init.sql` implémentent ces accès. Le premier
compte admin peut être promu via **Authentication → Users → Edit** (colonne
`role`) ou :

```sql
update public.users set role = 'admin' where email = 'vous@exemple.com';
```

## 7. Déploiement (Cloudflare Pages)

1. Dashboard Cloudflare Pages → **Settings → Environment variables**.
2. Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (clés publiques).
3. Rebuilder.

## Vérifier que ça marche

```bash
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run dev
# dans la console navigateur :
# "[nelvin] Using Supabase backend"
```