import { ArticleCard } from "./ArticleCard";
import type { WPPost } from "@/lib/types";

type Props = {
  posts: WPPost[];
};

export function ArticleList({ posts }: Props) {
  if (!posts.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 text-lg">Aucun article pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}
