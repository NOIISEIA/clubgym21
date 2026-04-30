// ============================================================
//  GraphQL Queries — Pages WPGraphQL + ACF
//
//  Les noms de types des layouts ACF Flexible Content suivent
//  la convention WPGraphQL for ACF :
//  {PostType}_{FieldGroupGraphqlName}_{FieldName}_{LayoutName}
//  → Page_Acfsections_Sections_Hero, etc.
//
//  Si vos types diffèrent, inspectez le schéma GraphQL via
//  https://wp.votre-domaine.com/graphql (introspection)
// ============================================================

export const GET_ALL_PAGE_URIS = `
  query GetAllPageUris {
    pages(first: 200) {
      nodes {
        slug
        uri
      }
    }
  }
`;

export const GET_PAGE = `
  query GetPage($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Page {
        id
        title
        slug
        uri
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
        }
        acfSections {
          sections {
            __typename
            ... on AcfSectionsSectionsHeroLayout {
              title
              subtitle
              ctaText
              ctaLink
              backgroundImage {
                node { sourceUrl altText }
              }
            }
            ... on AcfSectionsSectionsAboutLayout {
              label
              title
              description
              image {
                node { sourceUrl altText }
              }
              link
            }
            ... on AcfSectionsSectionsStatsLayout {
              statItems {
                icon
                value
                label
              }
            }
            ... on AcfSectionsSectionsServicesLayout {
              title
              subtitle
            }
            ... on AcfSectionsSectionsValuesLayout {
              title
              valueItems {
                icon
                title
                description
              }
            }
            ... on AcfSectionsSectionsEquipmentLayout {
              title
              subtitle
              image {
                node { sourceUrl altText }
              }
              equipmentItems {
                item
              }
            }
            ... on AcfSectionsSectionsTestimonialsLayout {
              title
              subtitle
            }
            ... on AcfSectionsSectionsCtaLayout {
              title
              subtitle
              ctaText
              ctaLink
              image {
                node { sourceUrl altText }
              }
            }
          }
        }
      }
    }
  }
`;
