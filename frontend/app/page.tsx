import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/wordpress";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/");
  if (!page?.seo) return {};
  return {
    title: page.seo.title || page.title,
    description: page.seo.metaDesc,
    openGraph: {
      title: page.seo.opengraphTitle || page.title,
      description: page.seo.opengraphDescription || page.seo.metaDesc,
      images: page.seo.opengraphImage
        ? [page.seo.opengraphImage.sourceUrl]
        : [],
    },
  };
}

export default async function HomePage() {
  const page = await getPage("/");
  if (!page) notFound();

  const sections = page.acfSections?.sections ?? [];

  return <SectionRenderer sections={sections} />;
}
