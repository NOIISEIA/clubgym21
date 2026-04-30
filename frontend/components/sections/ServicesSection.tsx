import Link from "next/link";
import { WPImage } from "@/components/ui/WPImage";
import type { SectionServices, WPService } from "@/lib/types";

type Props = SectionServices & {
  services: WPService[];
};

export function ServicesSection({ title, subtitle, services }: Props) {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {services.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {service.acfService?.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <WPImage
                      image={service.acfService.image}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  {service.acfService?.icon && (
                    <span
                      className="text-3xl mb-3 block"
                      aria-hidden="true"
                    >
                      {service.acfService.icon}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Aucune prestation à afficher.
          </p>
        )}
      </div>
    </section>
  );
}
