<?php
/**
 * ADG21 Headless Theme — functions.php
 *
 * Rôle : configuration WordPress pour le mode headless.
 * Le front est entièrement géré par Next.js.
 * Ce fichier :
 *   - Enregistre les CPTs (service, testimonial)
 *   - Enregistre les menus (header, footer)
 *   - Crée la page d'options ACF globales
 *   - Redirige le front WordPress vers Next.js
 *   - Configure les en-têtes CORS pour WPGraphQL
 *   - Envoie un webhook vers Next.js à chaque mise à jour de contenu
 */

defined( 'ABSPATH' ) || exit;

// ============================================================
//  1. Support de base du thème
// ============================================================

add_action( 'after_setup_theme', function () {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );

    // Enregistrement des menus
    register_nav_menus( [
        'header' => __( 'Menu Header', 'adg21-headless' ),
        'footer' => __( 'Menu Footer', 'adg21-headless' ),
    ] );
} );

// ============================================================
//  2. CPT — Service
// ============================================================

add_action( 'init', function () {
    register_post_type( 'service', [
        'labels'              => [
            'name'          => 'Prestations',
            'singular_name' => 'Prestation',
            'add_new_item'  => 'Ajouter une prestation',
            'edit_item'     => 'Modifier la prestation',
        ],
        'public'              => true,
        'has_archive'         => false,
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'menu_icon'           => 'dashicons-hammer',
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'service',
        'graphql_plural_name' => 'services',
        'rewrite'             => [ 'slug' => 'prestations' ],
    ] );
} );

// ============================================================
//  3. CPT — Témoignage
// ============================================================

add_action( 'init', function () {
    register_post_type( 'testimonial', [
        'labels'              => [
            'name'          => 'Témoignages',
            'singular_name' => 'Témoignage',
            'add_new_item'  => 'Ajouter un témoignage',
            'edit_item'     => 'Modifier le témoignage',
        ],
        'public'              => false,
        'show_ui'             => true,
        'has_archive'         => false,
        'supports'            => [ 'title' ],
        'menu_icon'           => 'dashicons-format-quote',
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'testimonial',
        'graphql_plural_name' => 'testimonials',
    ] );
} );

// ============================================================
//  4. ACF — Page d'options globales
//  (nécessite ACF Pro avec le module Options Page activé)
// ============================================================

add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_options_page' ) ) {
        return;
    }

    acf_add_options_page( [
        'page_title'         => 'Options du site',
        'menu_title'         => 'Options du site',
        'menu_slug'          => 'site-options',
        'capability'         => 'manage_options',
        'icon_url'           => 'dashicons-admin-settings',
        'redirect'           => false,
        'show_in_graphql'    => true,
        'graphql_field_name' => 'siteOptions',
    ] );
} );

// ============================================================
//  5. Redirection front WordPress → Next.js
//  Active uniquement si HEADLESS_FRONTEND_URL est défini
//  (ajouter dans wp-config.php)
// ============================================================

add_action( 'template_redirect', function () {
    if ( defined( 'HEADLESS_FRONTEND_URL' ) && HEADLESS_FRONTEND_URL ) {
        $current_url  = home_url( $_SERVER['REQUEST_URI'] );
        $home_url     = home_url( '/' );
        $relative_url = str_replace( $home_url, '/', $current_url );

        // Autoriser l'accès à wp-admin et wp-login
        if ( is_admin() || strpos( $relative_url, 'wp-admin' ) !== false ) {
            return;
        }

        wp_redirect( rtrim( HEADLESS_FRONTEND_URL, '/' ) . $relative_url, 301 );
        exit;
    }
} );

// ============================================================
//  6. CORS — autoriser les requêtes GraphQL depuis Next.js
// ============================================================

add_action( 'graphql_response_headers_to_send', function ( $headers ) {
    $allowed_origins = array_filter( [
        defined( 'HEADLESS_FRONTEND_URL' ) ? HEADLESS_FRONTEND_URL : '',
        'http://localhost:3000',
    ] );

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ( in_array( $origin, $allowed_origins, true ) ) {
        $headers['Access-Control-Allow-Origin']      = $origin;
        $headers['Access-Control-Allow-Credentials'] = 'true';
    } else {
        $headers['Access-Control-Allow-Origin'] = '*';
    }

    $headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    $headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';

    return $headers;
} );

// ============================================================
//  7. Webhook → Next.js ISR revalidation
//  Déclenché à chaque save_post (page, post, service, testimonial)
//
//  Ajouter dans wp-config.php :
//    define( 'HEADLESS_FRONTEND_URL', 'https://votre-domaine.com' );
//    define( 'HEADLESS_REVALIDATE_SECRET', 'votre-secret' );
// ============================================================

add_action( 'save_post', function ( $post_id, $post, $update ) {
    // Ignorer les révisions et les autosauvegardes
    if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
        return;
    }

    if ( ! defined( 'HEADLESS_FRONTEND_URL' ) || ! defined( 'HEADLESS_REVALIDATE_SECRET' ) ) {
        return;
    }

    $post_type = get_post_type( $post_id );
    $type_map  = [
        'post'        => 'post',
        'page'        => 'page',
        'service'     => 'page',
        'testimonial' => 'page',
    ];

    if ( ! array_key_exists( $post_type, $type_map ) ) {
        return;
    }

    $revalidate_url = rtrim( HEADLESS_FRONTEND_URL, '/' )
        . '/api/revalidate?secret='
        . HEADLESS_REVALIDATE_SECRET;

    wp_remote_post( $revalidate_url, [
        'method'    => 'POST',
        'timeout'   => 10,
        'blocking'  => false,
        'headers'   => [ 'Content-Type' => 'application/json' ],
        'body'      => wp_json_encode( [
            'type' => $type_map[ $post_type ],
            'slug' => $post->post_name,
        ] ),
    ] );
}, 10, 3 );
