import type { SectionTestimonials, WPTestimonial } from "@/lib/types";

type Props = SectionTestimonials & {
  testimonials: WPTestimonial[];
};

export function TestimonialsSection({ title, subtitle, testimonials }: Props) {
  const validTestimonials = testimonials.filter((t) => !!t.acfTestimonial);

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {validTestimonials.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {validTestimonials.map((t) => {
              const d = t.acfTestimonial!;
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl p-8 shadow-sm flex flex-col"
                >
                  {d.rating && (
                    <div className="flex gap-1 mb-5" aria-label={`Note : ${d.rating}/5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < d.rating!
                              ? "text-yellow-400 text-xl"
                              : "text-gray-200 text-xl"
                          }
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 italic leading-relaxed mb-6 flex-1">
                    &ldquo;{d.content}&rdquo;
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-bold text-gray-900">{d.author}</p>
                    {d.company && (
                      <p className="text-sm text-gray-500">{d.company}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Aucun témoignage à afficher.
          </p>
        )}
      </div>
    </section>
  );
}
