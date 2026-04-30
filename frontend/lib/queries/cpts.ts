export const GET_ALL_SERVICES = `
  query GetAllServices {
    services(first: 100) {
      nodes {
        id
        title
        slug
        content
        acfService {
          image {
            node { sourceUrl altText }
          }
          icon
        }
      }
    }
  }
`;

export const GET_ALL_TESTIMONIALS = `
  query GetAllTestimonials {
    testimonials(first: 100) {
      nodes {
        id
        acfTestimonial {
          author
          content
          rating
          company
        }
      }
    }
  }
`;
