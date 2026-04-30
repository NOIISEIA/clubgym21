export const GET_MENUS = `
  query GetMenus {
    menus {
      nodes {
        id
        name
        slug
        menuItems {
          nodes {
            id
            label
            url
            parentId
            childItems {
              nodes {
                id
                label
                url
                parentId
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_GLOBAL_OPTIONS = `
  query GetGlobalOptions {
    siteOptions {
      acfOptions {
        logo {
          node { sourceUrl altText }
        }
        phone
        email
        address
        facebookUrl
        twitterUrl
        instagramUrl
        linkedinUrl
        youtubeUrl
        footerText
        footerLinks {
          label
          url
        }
      }
    }
  }
`;
