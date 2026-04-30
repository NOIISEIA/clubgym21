import Link from "next/link";
import { WPImage } from "@/components/ui/WPImage";
import type { WPPost } from "@/lib/types";

type Props = {
  post: WPPost;
};

export function ArticleCard({ post }: Props) {
  const date = new Date(post.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {post.featuredImage && (
        <Link
          href={`/blog/${post.slug}`}
          className="block relative aspect-video overflow-hidden"
        >
          <WPImage
            image={post.featuredImage}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      <div className="p-6">
        {(post.categories?.nodes?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories!.nodes.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/categorie/${cat.slug}`}
                className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <div
            className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}
        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-50">
          <time dateTime={post.date}>{date}</time>
          {post.author?.node.name && (
            <span>{post.author.node.name}</span>
          )}
        </div>
      </div>
    </article>
  );
}
