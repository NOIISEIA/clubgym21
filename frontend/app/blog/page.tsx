import type { Metadata } from "next";
import { getPosts, getAllCategories } from "@/lib/wordpress";
import { ArticleList } from "@/components/blog/ArticleList";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { Pagination } from "@/components/blog/Pagination";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tous nos articles",
};

const POSTS_PER_PAGE = 9;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [postsData, categories] = await Promise.all([
    getPosts(POSTS_PER_PAGE),
    getAllCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <header className="mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Blog
        </h1>
        <p className="text-lg text-gray-600">Nos derniers articles</p>
      </header>

      <CategoryFilter categories={categories} />

      <ArticleList posts={postsData.nodes} />

      <Pagination
        currentPage={currentPage}
        hasNextPage={postsData.pageInfo.hasNextPage}
        hasPreviousPage={postsData.pageInfo.hasPreviousPage}
        basePath="/blog"
      />
    </div>
  );
}
