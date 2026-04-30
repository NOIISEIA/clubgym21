import type { MetadataRoute } from "next";
import { getAllPageUris, getAllPostSlugs, getAllCategories } from "@/lib/wordpress";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://votre-domaine.com";

  const [pages, posts, categories] = await Promise.all([
    getAllPageUris(),
    getAllPostSlugs(),
    getAllCategories(),
  ]);

  const pageUrls: MetadataRoute.Sitemap = pages
    .filter((p) => p.uri && p.uri !== "/")
    .map((page) => ({
      url: `${siteUrl}${page.uri}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/blog/categorie/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...pageUrls,
    ...postUrls,
    ...categoryUrls,
  ];
}
