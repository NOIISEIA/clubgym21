import { WPImage } from "@/components/ui/WPImage";
import { Button } from "@/components/ui/Button";
import type { SectionCta } from "@/lib/types";

export function CtaSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  image,
}: SectionCta) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-primary">
      {image && (
        <div className="absolute inset-0 z-0 opacity-15">
          <WPImage
            image={image}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <Button label={ctaText} href={ctaLink} variant="secondary" size="lg" />
      </div>
    </section>
  );
}
