import { WPImage } from "@/components/ui/WPImage";
import type { SectionEquipment } from "@/lib/types";

export function EquipmentSection({
  title,
  subtitle,
  image,
  equipmentItems,
}: SectionEquipment) {
  return (
    <section className="py-20 lg:py-28 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {image && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <WPImage
                image={image}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}

          {equipmentItems && equipmentItems.length > 0 && (
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {equipmentItems.map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200">
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full bg-secondary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{it.item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
