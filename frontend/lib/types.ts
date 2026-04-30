// ============================================================
//  Types WordPress — Site Headless
// ============================================================

// --- Médias ---

export type WPImageNode = {
  sourceUrl: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type WPImage = {
  node: WPImageNode;
};

// --- SEO Yoast ---

export type WPSeo = {
  title?: string;
  metaDesc?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: { sourceUrl: string };
  twitterTitle?: string;
  twitterDescription?: string;
};

// --- Menus ---

export type MenuItem = {
  id: string;
  label: string;
  url: string;
  parentId: string | null;
  childItems?: { nodes: MenuItem[] };
};

export type WPMenu = {
  id: string;
  name: string;
  slug: string;
  menuItems: { nodes: MenuItem[] };
};

// --- Options globales (ACF Options Page) ---

export type GlobalOptions = {
  acfOptions: {
    logo?: WPImage;
    logoAlt?: WPImage;
    phone?: string;
    email?: string;
    address?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
    footerText?: string;
    footerLinks?: { label: string; url: string }[];
  };
};

// ============================================================
//  Sections — ACF Flexible Content
//  Nommage WPGraphQL for ACF : {PostType}_{GroupName}_{Field}_{Layout}
// ============================================================

export type SectionHero = {
  __typename: "AcfSectionsSectionsHeroLayout";
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: WPImage;
};

export type SectionAbout = {
  __typename: "AcfSectionsSectionsAboutLayout";
  label?: string;
  title: string;
  description?: string;
  image?: WPImage;
  link?: string;
};

export type StatItem = {
  icon?: string;
  value: string;
  label: string;
};

export type SectionStats = {
  __typename: "AcfSectionsSectionsStatsLayout";
  statItems: StatItem[] | null;
};

export type SectionServices = {
  __typename: "AcfSectionsSectionsServicesLayout";
  title: string;
  subtitle?: string;
};

export type ValueItem = {
  icon?: string;
  title: string;
  description: string;
};

export type SectionValues = {
  __typename: "AcfSectionsSectionsValuesLayout";
  title: string;
  valueItems: ValueItem[] | null;
};

export type EquipmentItem = {
  item: string;
};

export type SectionEquipment = {
  __typename: "AcfSectionsSectionsEquipmentLayout";
  title: string;
  subtitle?: string;
  image?: WPImage;
  equipmentItems: EquipmentItem[] | null;
};

export type SectionTestimonials = {
  __typename: "AcfSectionsSectionsTestimonialsLayout";
  title: string;
  subtitle?: string;
};

export type SectionCta = {
  __typename: "AcfSectionsSectionsCtaLayout";
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  image?: WPImage;
};

export type PageSection =
  | SectionHero
  | SectionAbout
  | SectionStats
  | SectionServices
  | SectionValues
  | SectionEquipment
  | SectionTestimonials
  | SectionCta;

// ============================================================
//  Pages
// ============================================================

export type WPPage = {
  id: string;
  title: string;
  slug: string;
  uri: string;
  seo?: WPSeo;
  acfSections?: {
    sections: PageSection[] | null;
  };
};

// ============================================================
//  Custom Post Types
// ============================================================

export type WPService = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  acfService?: {
    image?: WPImage;
    icon?: string;
  };
};

export type WPTestimonial = {
  id: string;
  acfTestimonial?: {
    author: string;
    content: string;
    rating?: number;
    company?: string;
  };
};

// ============================================================
//  Blog
// ============================================================

export type WPCategory = {
  id: string;
  name: string;
  slug: string;
  count?: number;
};

export type WPPost = {
  id: string;
  title: string;
  slug: string;
  uri: string;
  date: string;
  excerpt?: string;
  content?: string;
  seo?: WPSeo;
  featuredImage?: WPImage;
  author?: {
    node: {
      name: string;
      avatar?: { url: string };
    };
  };
  categories?: { nodes: WPCategory[] };
};

export type WPPostsResponse = {
  nodes: WPPost[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
};
