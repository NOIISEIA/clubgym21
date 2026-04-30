import { getAllServices, getAllTestimonials } from "@/lib/wordpress";
import type { PageSection } from "@/lib/types";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { StatsSection } from "./StatsSection";
import { ServicesSection } from "./ServicesSection";
import { ValuesSection } from "./ValuesSection";
import { EquipmentSection } from "./EquipmentSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaSection } from "./CtaSection";

type Props = {
  sections: PageSection[];
};

// Composant serveur : pré-fetch les CPTs uniquement si des sections les nécessitent
export async function SectionRenderer({ sections }: Props) {
  const needsServices = sections.some(
    (s) => s.__typename === "AcfSectionsSectionsServicesLayout"
  );
  const needsTestimonials = sections.some(
    (s) => s.__typename === "AcfSectionsSectionsTestimonialsLayout"
  );

  const [services, testimonials] = await Promise.all([
    needsServices ? getAllServices() : Promise.resolve([]),
    needsTestimonials ? getAllTestimonials() : Promise.resolve([]),
  ]);

  return (
    <>
      {sections.map((section, i) => {
        switch (section.__typename) {
          case "AcfSectionsSectionsHeroLayout":
            return <HeroSection key={i} {...section} />;

          case "AcfSectionsSectionsAboutLayout":
            return <AboutSection key={i} {...section} />;

          case "AcfSectionsSectionsStatsLayout":
            return <StatsSection key={i} {...section} />;

          case "AcfSectionsSectionsServicesLayout":
            return (
              <ServicesSection key={i} {...section} services={services} />
            );

          case "AcfSectionsSectionsValuesLayout":
            return <ValuesSection key={i} {...section} />;

          case "AcfSectionsSectionsEquipmentLayout":
            return <EquipmentSection key={i} {...section} />;

          case "AcfSectionsSectionsTestimonialsLayout":
            return (
              <TestimonialsSection
                key={i}
                {...section}
                testimonials={testimonials}
              />
            );

          case "AcfSectionsSectionsCtaLayout":
            return <CtaSection key={i} {...section} />;

          default:
            return null;
        }
      })}
    </>
  );
}
