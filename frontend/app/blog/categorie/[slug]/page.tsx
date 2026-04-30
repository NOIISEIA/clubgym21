import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByCategory, getCategory, getAllCategories } from "@/lib/wordpress";
import { ArticleList } from "@/components/blog/ArticleList";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { Pagination } from "@/components/blog/Pagination";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Blog`,
    description: `Tous les articles de la catégorie ${category.name}`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [postsData, category, categories] = await Promise.all([
    getPostsByCategory(slug, 9),
    getCategory(slug),
    getAllCategories(),
  ]);

  if (!category) notFound();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <header className="mb-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
          Catégorie
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          {category.name}
        </h1>
        {category.count && (
          <p className="text-gray-500">
            {category.count} article{category.count > 1 ? "s" : ""}
          </p>
        )}
      </header>

      <CategoryFilter categories={categories} activeSlug={slug} />

      <ArticleList posts={postsData.nodes} />

      <Pagination
        currentPage={currentPage}
        hasNextPage={postsData.pageInfo.hasNextPage}
        hasPreviousPage={postsData.pageInfo.hasPreviousPage}
        basePath={`/blog/categorie/${slug}`}
      />
    </div>
  );
}
