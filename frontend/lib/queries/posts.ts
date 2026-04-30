const POST_FRAGMENT = `
  id
  title
  slug
  uri
  date
  excerpt
  featuredImage {
    node { sourceUrl altText }
  }
  author {
    node {
      name
      avatar { url }
    }
  }
  categories {
    nodes { id name slug }
  }
`;

export const GET_ALL_POSTS = `
  query GetAllPosts($first: Int = 9, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes { ${POST_FRAGMENT} }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_POST = `
  query GetPost($slug: String!) {
    postBy(slug: $slug) {
      ${POST_FRAGMENT}
      content
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        opengraphImage { sourceUrl }
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($slug: String!, $first: Int = 9, $after: String) {
    posts(
      first: $first
      after: $after
      where: { status: PUBLISH, categoryName: $slug }
    ) {
      nodes { ${POST_FRAGMENT} }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories(first: 100, where: { hideEmpty: true }) {
      nodes { id name slug count }
    }
  }
`;

export const GET_CATEGORY = `
  query GetCategory($slug: String!) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
    }
  }
`;

export const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs {
    posts(first: 1000, where: { status: PUBLISH }) {
      nodes { slug uri }
    }
  }
`;
