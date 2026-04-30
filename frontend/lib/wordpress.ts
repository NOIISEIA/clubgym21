import { cache } from "react";
import { GET_PAGE, GET_ALL_PAGE_URIS } from "./queries/pages";
import {
  GET_ALL_POSTS,
  GET_POST,
  GET_POSTS_BY_CATEGORY,
  GET_ALL_CATEGORIES,
  GET_CATEGORY,
  GET_ALL_POST_SLUGS,
} from "./queries/posts";
import { GET_ALL_SERVICES, GET_ALL_TESTIMONIALS } from "./queries/cpts";
import { GET_MENUS, GET_GLOBAL_OPTIONS } from "./queries/global";
import type {
  WPPage,
  WPPost,
  WPPostsResponse,
  WPCategory,
  WPService,
  WPTestimonial,
  WPMenu,
  GlobalOptions,
} from "./types";

// ============================================================
//  Client GraphQL
// ============================================================

async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 60
): Promise<T> {
  const wpUrl = process.env.WORDPRESS_URL;

  if (!wpUrl) {
    throw new Error(
      "WORDPRESS_URL n'est pas défini. Vérifiez votre fichier .env.local"
    );
  }

  const res = await fetch(`${wpUrl}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(
      `Erreur WordPress GraphQL: ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join(", ")
    );
  }

  return json.data as T;
}

// ============================================================
//  Pages
// ============================================================

export const getPage = cache(async (uri: string): Promise<WPPage | null> => {
  try {
    const data = await fetchGraphQL<{ nodeByUri: WPPage | null }>(GET_PAGE, {
      uri,
    });
    return data.nodeByUri ?? null;
  } catch (err) {
    console.error(`[WP] getPage(${uri}):`, err);
    return null;
  }
});

export const getAllPageUris = cache(
  async (): Promise<{ slug: string; uri: string }[]> => {
    try {
      const data = await fetchGraphQL<{
        pages: { nodes: { slug: string; uri: string }[] };
      }>(GET_ALL_PAGE_URIS, {}, 3600);
      return data.pages.nodes;
    } catch (err) {
      console.error("[WP] getAllPageUris:", err);
      return [];
    }
  }
);

// ============================================================
//  Blog
// ============================================================

export async function getPosts(
  first = 9,
  after?: string
): Promise<WPPostsResponse> {
  try {
    const data = await fetchGraphQL<{ posts: WPPostsResponse }>(
      GET_ALL_POSTS,
      { first, after }
    );
    return data.posts;
  } catch (err) {
    console.error("[WP] getPosts:", err);
    return {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "",
        endCursor: "",
      },
    };
  }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const data = await fetchGraphQL<{ postBy: WPPost | null }>(GET_POST, {
      slug,
    });
    return data.postBy ?? null;
  } catch (err) {
    console.error(`[WP] getPost(${slug}):`, err);
    return null;
  }
}

export async function getPostsByCategory(
  slug: string,
  first = 9,
  after?: string
): Promise<WPPostsResponse> {
  try {
    const data = await fetchGraphQL<{ posts: WPPostsResponse }>(
      GET_POSTS_BY_CATEGORY,
      { slug, first, after }
    );
    return data.posts;
  } catch (err) {
    console.error(`[WP] getPostsByCategory(${slug}):`, err);
    return {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "",
        endCursor: "",
      },
    };
  }
}

export const getAllCategories = cache(async (): Promise<WPCategory[]> => {
  try {
    const data = await fetchGraphQL<{
      categories: { nodes: WPCategory[] };
    }>(GET_ALL_CATEGORIES, {}, 3600);
    return data.categories.nodes;
  } catch (err) {
    console.error("[WP] getAllCategories:", err);
    return [];
  }
});

export async function getCategory(
  slug: string
): Promise<WPCategory | null> {
  try {
    const data = await fetchGraphQL<{ category: WPCategory | null }>(
      GET_CATEGORY,
      { slug }
    );
    return data.category ?? null;
  } catch (err) {
    console.error(`[WP] getCategory(${slug}):`, err);
    return null;
  }
}

export const getAllPostSlugs = cache(
  async (): Promise<{ slug: string; uri: string }[]> => {
    try {
      const data = await fetchGraphQL<{
        posts: { nodes: { slug: string; uri: string }[] };
      }>(GET_ALL_POST_SLUGS, {}, 3600);
      return data.posts.nodes;
    } catch (err) {
      console.error("[WP] getAllPostSlugs:", err);
      return [];
    }
  }
);

// ============================================================
//  Custom Post Types
// ============================================================

export const getAllServices = cache(async (): Promise<WPService[]> => {
  try {
    const data = await fetchGraphQL<{ services: { nodes: WPService[] } }>(
      GET_ALL_SERVICES,
      {},
      3600
    );
    return data.services.nodes;
  } catch (err) {
    console.error("[WP] getAllServices:", err);
    return [];
  }
});

export const getAllTestimonials = cache(async (): Promise<WPTestimonial[]> => {
  try {
    const data = await fetchGraphQL<{
      testimonials: { nodes: WPTestimonial[] };
    }>(GET_ALL_TESTIMONIALS, {}, 3600);
    return data.testimonials.nodes;
  } catch (err) {
    console.error("[WP] getAllTestimonials:", err);
    return [];
  }
});

// ============================================================
//  Global — menus + options
//  Wrappées dans React.cache pour éviter les requêtes dupliquées
//  entre Header et Footer lors du même rendu serveur
// ============================================================

export const getMenus = cache(async (): Promise<WPMenu[]> => {
  try {
    const data = await fetchGraphQL<{ menus: { nodes: WPMenu[] } }>(
      GET_MENUS,
      {},
      3600
    );
    return data.menus.nodes;
  } catch (err) {
    console.error("[WP] getMenus:", err);
    return [];
  }
});

export const getGlobalOptions = cache(
  async (): Promise<GlobalOptions | null> => {
    try {
      const data = await fetchGraphQL<{
        siteOptions: GlobalOptions;
      }>(GET_GLOBAL_OPTIONS, {}, 3600);
      return data.siteOptions ?? null;
    } catch (err) {
      console.error("[WP] getGlobalOptions:", err);
      return null;
    }
  }
);
