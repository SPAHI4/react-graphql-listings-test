import { getListings, GetListingsOptions } from '../services/listings-service';

const typeDefs = /* GraphQL */ `
  type Listing {
    id: String!
    listing_url: String!
    name: String!
    description: String!
    neighbourhood: String!
    neighbourhood_cleansed: String!
    price: String!
    neighbourhood_score: Float
  }

  type Query {
    listings(limit: Int!): [Listing!]!
  }
`;

const resolvers = {
  Query: {
    listings: async (parent: unknown, options: GetListingsOptions) => {
      return getListings(options);
    },
  },
  Listing: {
    neighbourhood_score: () => null,
  },
};

export { typeDefs, resolvers };
