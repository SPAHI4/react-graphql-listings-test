import { createServer, useErrorHandler } from '@graphql-yoga/node';

import * as listingType from './modules/Listing/index.js';
import { GraphQLContext } from './schema/context.js';
import { prisma } from './services/prisma.js';
import { createNeighborhoodScoreLoader } from './modules/Listing/loaders.js';

const server = createServer<GraphQLContext>({
  port: 4001,
  schema: {
    resolvers: [listingType.resolvers],
    typeDefs: [listingType.typeDefs],
  },
  context: () => ({
    prisma,
    neighborhoodScoreLoader: createNeighborhoodScoreLoader(prisma),
  }),
  maskedErrors: false,
  plugins: [
    useErrorHandler((errors) => {
      errors.forEach((err) => console.error(err));
    }),
  ],
});

server.start().catch((err) => console.error(err));
