# ADG21 — Site headless WordPress + Next.js

Site composé de :

- **`frontend/`** — Application Next.js 16 (App Router, TypeScript, Tailwind v4) déployée sur Vercel
- **`_wordpress/`** — Thème headless + ACF JSON + guide de setup pour le WordPress (à uploader manuellement sur l'hébergeur)

## Architecture

```
Visiteurs → adg21.myworknoiise.com (Next.js / Vercel)
                    ↓ GraphQL
         wp.adg21.myworknoiise.com (WordPress / o2switch)
```

## Démarrage local

```bash
cd frontend
cp .env.local.example .env.local
# Remplir les variables WORDPRESS_URL etc.
npm install
npm run dev
```

Front disponible sur `http://localhost:3000`.

## Documentation

- [`_wordpress/SETUP.md`](_wordpress/SETUP.md) — Configuration WordPress
- [`.cursor/rules/wordpress-headless-setup.mdc`](.cursor/rules/wordpress-headless-setup.mdc) — Pièges connus & conventions

## Déploiement

- **Frontend** : push sur la branche `main` → déploiement automatique Vercel
- **WordPress** : modifications via l'admin WP, le webhook ISR notifie Vercel pour revalider les pages
