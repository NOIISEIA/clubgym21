# Guide de configuration WordPress Headless — ADG21

## 1. Prérequis

- WordPress 6.x installé et accessible
- PHP 8.1+
- Permaliens réglés sur **/%postname%/** (Réglages → Permaliens)

## 2. Plugins à installer

| Plugin | Où l'obtenir | Obligatoire |
|---|---|---|
| **ACF Pro** | acfpro.com (licence requise) | ✅ |
| **WPGraphQL** | wordpress.org/plugins/wp-graphql | ✅ |
| **WPGraphQL for ACF** | github.com/wp-graphql/wpgraphql-acf | ✅ |
| **Yoast SEO** | wordpress.org/plugins/wordpress-seo | ✅ |
| **Add WPGraphQL SEO** (Yoast) | wordpress.org/plugins/add-wpgraphql-seo | ✅ |

### Ordre d'activation recommandé
1. ACF Pro
2. WPGraphQL
3. WPGraphQL for ACF
4. Yoast SEO
5. Add WPGraphQL SEO

## 3. Thème headless

1. Copier le dossier `themes/adg21-headless/` dans `wp-content/themes/`
2. Activer le thème dans **Apparence → Thèmes**

## 4. Importer les groupes de champs ACF

1. Aller dans **ACF → Synchronisation**
2. Les fichiers JSON du dossier `acf-json/` doivent apparaître automatiquement  
   (ACF lit le dossier `acf-json/` dans le thème actif — copier aussi les JSON dans `wp-content/themes/adg21-headless/acf-json/`)
3. Cliquer sur **Synchroniser tout**

Les groupes créés sont :
- **Sections de page** → champs Flexible Content sur toutes les Pages
- **Prestation — champs** → image + icône sur le CPT Service
- **Témoignage — champs** → auteur, contenu, note, entreprise
- **Options globales** → logo, coordonnées, réseaux sociaux, footer

## 5. Créer les menus

1. **Apparence → Menus**
2. Créer un menu nommé **Header** et l'assigner à l'emplacement **Menu Header**
3. Créer un menu nommé **Footer** et l'assigner à l'emplacement **Menu Footer**

## 6. Configuration WPGraphQL

1. Aller dans **GraphQL → Réglages**
2. Activer : **Enable Public Introspection** (pour le développement)
3. Vérifier que l'endpoint est : `https://wp.votre-domaine.com/graphql`

## 7. Configuration wp-config.php

Ajouter ces constantes dans `wp-config.php` (avant `/* That's all, stop editing! */`) :

```php
// URL du front Next.js (sans slash final)
define( 'HEADLESS_FRONTEND_URL', 'https://votre-domaine.com' );

// Secret partagé avec Next.js pour la revalidation ISR
// Doit correspondre à REVALIDATE_SECRET dans .env.local
define( 'HEADLESS_REVALIDATE_SECRET', 'votre-secret-ici' );
```

## 8. Page d'options ACF

1. Dans le menu WordPress admin, cliquer sur **Options du site**
2. Remplir : logo, coordonnées, réseaux sociaux, texte de copyright

## 9. Créer la page d'accueil

1. **Pages → Ajouter**
2. Titre : `Accueil` (slug : `accueil` ou `home`)
3. Régler cette page comme page d'accueil dans **Réglages → Lecture**
4. Ajouter des sections via le bloc **Sections de page**

> ⚠️ Le composant Next.js récupère la page d'accueil via l'URI `/`.  
> Assurez-vous que WordPress renvoie bien cette page via `nodeByUri(uri: "/")`.

## 10. Vérification GraphQL

Tester les requêtes dans le playground WPGraphQL :
`https://wp.votre-domaine.com/graphql` (via GraphiQL IDE : GraphQL → GraphiQL IDE)

### Test page
```graphql
{
  nodeByUri(uri: "/") {
    ... on Page {
      title
      acfSections {
        sections {
          __typename
        }
      }
    }
  }
}
```

### Test articles
```graphql
{
  posts(first: 3) {
    nodes { title slug date }
  }
}
```

### Test options
```graphql
{
  acfOptionsOptions {
    acfOptions { phone email }
  }
}
```

## 11. Nommage des types GraphQL ACF (important)

Les types des layouts Flexible Content générés par WPGraphQL for ACF suivent la convention :

```
{PostType}_{FieldGroupGraphqlName}_{FieldName}_{LayoutName}
```

Pour notre configuration :
- `Page_Acfsections_Sections_Hero`
- `Page_Acfsections_Sections_About`
- `Page_Acfsections_Sections_Stats`
- `Page_Acfsections_Sections_Services`
- `Page_Acfsections_Sections_Values`
- `Page_Acfsections_Sections_Equipment`
- `Page_Acfsections_Sections_Testimonials`
- `Page_Acfsections_Sections_Cta`

Si les types retournés par votre WPGraphQL sont différents, vérifiez via GraphiQL et 
mettez à jour :
- `frontend/lib/types.ts` (les `__typename`)
- `frontend/components/sections/SectionRenderer.tsx` (les `case` du switch)
- `frontend/lib/queries/pages.ts` (les fragments inline `... on XxxType`)

## 12. Déploiement Vercel

1. Connecter le dépôt GitHub à Vercel
2. Répertoire racine : `frontend/`
3. Variables d'environnement à configurer dans Vercel :
   - `WORDPRESS_URL`
   - `WORDPRESS_HOSTNAME`
   - `NEXT_PUBLIC_SITE_URL`
   - `REVALIDATE_SECRET`
4. Après déploiement, récupérer l'URL Vercel et l'ajouter dans `wp-config.php`
