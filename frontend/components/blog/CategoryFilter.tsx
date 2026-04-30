import Link from "next/link";
import type { WPCategory } from "@/lib/types";

type Props = {
  categories: WPCategory[];
  activeSlug?: string;
};

export function CategoryFilter({ categories, activeSlug }: Props) {
  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-10">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeSlug
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Tous les articles
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blog/categorie/${cat.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSlug === cat.slug
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.name}
          {cat.count ? (
            <span className="ml-1 opacity-60">({cat.count})</span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
