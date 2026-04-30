import { WPImage } from "@/components/ui/WPImage";
import { Button } from "@/components/ui/Button";
import type { SectionAbout } from "@/lib/types";

export function AboutSection({
  label,
  title,
  description,
  image,
  link,
}: SectionAbout) {
  const hasImage = !!image;

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid gap-12 items-center ${
            hasImage ? "lg:grid-cols-2" : ""
          }`}
        >
          {hasImage && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <WPImage
                image={image}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}

          <div className={!hasImage ? "max-w-3xl" : ""}>
            {label && (
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                {label}
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {description}
              </p>
            )}
            {link && (
              <Button label="En savoir plus" href={link} variant="outline" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
