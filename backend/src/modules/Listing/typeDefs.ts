export const typeDefs = /* GraphQL */ `
  type Listing {
    id: ID!
    listing_url: String!
    name: String!
    description: String!
    neighbourhood: String!
    neighbourhood_cleansed: String!
    price: Float!
    neighbourhood_score: Float
    foo: String
  }

  type PageInfo {
    hasNextPage: Boolean!
  }

  type ListingConnection {
    nodes: [Listing!]!
    pageInfo: PageInfo!
  }

  type Query {
    listings(limit: Int!, offset: Int!, search: String): ListingConnection!
  }
`;
