# Dette technique — Nelvin Benefits

Ce document recense les points à traiter lors des prochaines itérations. Rien ici ne bloque le build ou le fonctionnement actuel.

## 1. Contenu données non traduit (i18n partiel**

- Les **catégories** (`CategoriesGrid`) et les **onglets de FeaturedDeals** servent de **clés de filtrage** pour les offres Base44 (`o.category === activeName`). Les traduire casserait le filtrage: elles restent **volontairement** en anglais (documenté dans `docs/ARCHITECTURE.md`).
- Les **données de plans** (`src/lib/plansData.js`): name, desc, features, cta, period restent en anglais. Les titres/sections sont traduits.

- Prochaine étape: i18n les **données Base44** (prévoir un champ `name_i18n` par entité et une migration**), puis brancher les clés sur la langue active.



## 2. Couplage résiduel à Base44 dans les composants

- `FeaturedDeals.jsx` importe `db` directement (au lieu d'un `offersApi` dedié**. Toute la logique de données devrait être déplacée vers `src/services/api/` par domaine (offers, users, companies…**..
- `src/entities/` doit mapper les formes Base44 vers des types locaux pour cesser de propager les conventions Base44.





## 3. Fallback Base44 read-only

- Le fallback en mémoire (`src/services/api/base44Client.js`) rend l'UI renderable hors Base44 mais renvoie des données vides→ ne pas l'utiliser pour valider le métier..
- À remplacer par un adapter Supabase/PostgreSQL/API propriétaire lors de la migration(BASE44_DEPENDENCIES.md**.



## 4. Qualité / hygiène

- **Lignes inutilisées/dupliquées** dans la homepage (composants legacy Nelvin** à nettoyer à la demande.
- Certains composants mélangent data+UI dans le même fichier (`FeaturedDeals`, `CategoriesGrid`); les séparer en `data/` + `ui/` si elles grossissent。
- La hauteur de `BarChart`/`CorporateDashboard` est importante (~700 kB non-gzippé** — vérifier les imports Recharts code-split par page(si déjà split, évaluer le lazy loading de chart lourds.
- Quelques classes Tailwind arbitraires (`tracking-[0.2em]`, `rounded-[28px]`** pourraient devenir des tokens design le cas échéant.ils** (`nav` etc.
- `console.log` résiduels à chasser si rencontrés au fil de l'eau.



## 5. Routes / sécurité

- Les guard routes sont frontend-only→ la sécurité réelle doit être enforceée par Base44/le backend.
- Vérifier la révocation de sessions côté Base44 lors de `logout` (déconnexion locale seulement pour l'instant?.
- `_redirects` pour le SPA doit être ajouté au déploiement Cloudflare (voir DEPLOYMENT_CLOUDFLARE.md**.



## 6. Performance

- Le bundle `index` est ~1 MB (301 kB gzippé** — avantage de code-splitting par route(✅ déjà en place)**; les charts lourds restent chunkés par page(user côté admin**.
- `pdfjs-dist`/`jspdf`/`html2canvas` sont gros et chunkés отдельно(ok—chargés à la demande**.
- Vérifier les images Unsplash (hotlinking** → les auto-héberger dans un futur proche(ou passer par un proxy étiqueté**.



## 7. Noms / chemins

- Les composants marketing sont dans `src/components/nelvin/`(nom issue de l'ancien projet**; un renommage vers `src/components/marketing/` ou `home/` serait plus clair si souhaité(attention aux imports**.
- `src/contexts/` cohabite avec `src/app/providers/` — y centraliser progressivement les providers.



## 8. Durcissement auth restant

- **`0001_init.sql` : policy `users update own or admin` sans `WITH CHECK`.**
  La clause `USING` valide la ligne *avant* écriture ; sans `WITH CHECK`, un
  utilisateur pouvait réécrire sa propre ligne, y compris `role`. Le trigger de
  `supabase/migrations/0002_fix_role_escalation.sql` ferme le cas, mais la
  policy gagnerait à être explicite :
  `with check (auth.uid() = id or public.is_admin())`.
- **Policies admin fondées sur `is_admin()`, qui lit `public.users`.** Un
  `role` modifiable rendait le helper auto-autorisant. `is_admin()` est
  maintenant `security invoker` + `search_path` figé, et ignore les comptes
  suspendus — mais toute future policy admin devrait être relue sous cet angle.
- **`/corporate-dashboard` n'a pas de garde de rôle** côté route : un
  particulier y accède et voit « No company linked yet » au lieu d'un refus.
  Aucune fuite de données (le portail exige `user.company_id`), mais le message
  est trompeur. À aligner sur `AdminLayout`/`BusinessLayout`.
- Pas de `.env` dans ce dépôt : l'app tourne sur le backend de secours
  `localStorage` (`fallbackDb`). Les correctifs ci-dessus visent Supabase, qui
  est le backend réel en production.

## Résumé

| Dette | Impact | Effort |
|---|---|---|
| i18n données Base44/plans | UX multilingue incomplète pour contenu métier | Moyen |
| Couplage `db` dans composants | Migration Base44 future = touches aux composants | Faible (créer des API par domaine) |
| Fallback read-only | Pas de données en dev isolé | Moyen (adapter réel) |
| Bundle index ~1 MB | Chargement initial sur réseaux lents | Moyen (lazy d'illustrations/animations, revue imgs) |
| Renommage nelvin→marketing | Clarté | Faible (refactor imports) |
| Garde de rôle sur `/corporate-dashboard` | Message trompeur, pas de fuite | Faible |
| `WITH CHECK` explicite sur les policies `users` | Défense en profondeur (trigger déjà en place) | Faible |