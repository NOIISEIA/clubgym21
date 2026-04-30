import { WPImage } from "@/components/ui/WPImage";
import { Button } from "@/components/ui/Button";
import type { SectionHero } from "@/lib/types";

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
}: SectionHero) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gray-900">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <WPImage
            image={backgroundImage}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-white/85 mb-10 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
          {ctaText && ctaLink && (
            <Button label={ctaText} href={ctaLink} size="lg" />
          )}
        </div>
      </div>
    </section>
  );
}
