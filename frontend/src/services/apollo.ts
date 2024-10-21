import { ApolloClient, InMemoryCache } from '@apollo/client';

import { StrictTypedTypePolicies } from '../__generated__/apollo-helpers.ts';
import { offsetLimitPaginationWithConnectionObject } from '../utils/apollo.ts';

export const typePolicies: StrictTypedTypePolicies = {
  Query: {
    fields: {
      listings: offsetLimitPaginationWithConnectionObject(['$search']),
    },
  },
};

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache({
    typePolicies,
  }),
});
