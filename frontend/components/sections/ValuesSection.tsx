import type { SectionValues } from "@/lib/types";

export function ValuesSection({ title, valueItems }: SectionValues) {
  if (!valueItems?.length) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-14 text-center">
          {title}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueItems.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              {item.icon && (
                <span className="text-4xl mb-4 block" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
