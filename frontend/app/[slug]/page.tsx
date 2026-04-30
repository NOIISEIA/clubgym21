import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage, getAllPageUris } from "@/lib/wordpress";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getAllPageUris();
  // Exclure la page d'accueil (gérée par app/page.tsx)
  return pages
    .filter(
      (p) =>
        p.slug !== "" &&
        p.slug !== "accueil" &&
        p.slug !== "home" &&
        p.uri !== "/"
    )
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(`/${slug}`);
  if (!page) return {};
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.metaDesc,
    openGraph: {
      title: page.seo?.opengraphTitle || page.title,
      description: page.seo?.opengraphDescription || page.seo?.metaDesc,
      images: page.seo?.opengraphImage
        ? [page.seo.opengraphImage.sourceUrl]
        : [],
    },
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(`/${slug}`);
  if (!page) notFound();

  const sections = page.acfSections?.sections ?? [];

  return <SectionRenderer sections={sections} />;
}
