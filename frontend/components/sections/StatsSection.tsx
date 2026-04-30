import type { SectionStats } from "@/lib/types";

export function StatsSection({ statItems }: SectionStats) {
  if (!statItems?.length) return null;

  return (
    <section className="bg-primary py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid gap-10 ${
            statItems.length === 2
              ? "sm:grid-cols-2"
              : statItems.length === 3
              ? "sm:grid-cols-3"
              : "grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {statItems.map((stat, i) => (
            <div key={i} className="text-center text-white">
              {stat.icon && (
                <span className="text-4xl mb-3 block" aria-hidden="true">
                  {stat.icon}
                </span>
              )}
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-white/75 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
