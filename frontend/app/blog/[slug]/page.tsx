import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPost, getAllPostSlugs } from "@/lib/wordpress";
import { WPImage } from "@/components/ui/WPImage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const description =
    post.seo?.metaDesc ||
    post.excerpt?.replace(/<[^>]+>/g, "").slice(0, 160);

  return {
    title: post.seo?.title || post.title,
    description,
    openGraph: {
      title: post.seo?.opengraphTitle || post.title,
      description: post.seo?.opengraphDescription || description,
      images: post.seo?.opengraphImage
        ? [post.seo.opengraphImage.sourceUrl]
        : post.featuredImage?.node.sourceUrl
        ? [post.featuredImage.node.sourceUrl]
        : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const date = new Date(post.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article>
      {/* Image à la une */}
      {post.featuredImage && (
        <div className="relative h-72 sm:h-96 lg:h-[500px] overflow-hidden">
          <WPImage
            image={post.featuredImage}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Catégories */}
          {(post.categories?.nodes?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories!.nodes.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/categorie/${cat.slug}`}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-12 pb-8 border-b border-gray-100">
            <time dateTime={post.date}>{date}</time>
            {post.author?.node.name && (
              <span className="flex items-center gap-2">
                <span>·</span>
                <span>{post.author.node.name}</span>
              </span>
            )}
          </div>

          {post.content && (
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
