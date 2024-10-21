import { Prisma } from '@prisma/client';
import { Resolvers } from '../../__generated__/graphql.js';
import { getPrismaSelectFromInfo } from '../../utils/get-prisma-select.js';
import { simpleConnectionWrapper } from '../../utils/simple-connection-wrapper.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const resolvers = {
  Query: {
    listings: async (_, { limit, offset, search }, { prisma }, info) => {
      await sleep(1000); // simulate delay

      // select only requested fields
      // while overhead of fetching all fields is usually minimal, and it could look unnecessary, it could improve performance with covering indexes
      const selectFromInfo = getPrismaSelectFromInfo(Prisma.ListingScalarFieldEnum, info);
      const selectAlways = { neighbourhood_cleansed: true }; // always select neighbourhood_cleansed for neighbourhood_score

      const nodes = await prisma.listing.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { neighbourhood_cleansed: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        take: limit + 1, // fetch one more than requested to determine if there are more pages
        skip: offset,
        select: { ...selectFromInfo, ...selectAlways },
      });

      return simpleConnectionWrapper(nodes, limit);
    },
  },
  Listing: {
    neighbourhood_score: (parent, _, { neighborhoodScoreLoader }) => {
      return neighborhoodScoreLoader.load(parent.neighbourhood_cleansed);
    },
  },
} satisfies Resolvers; // use satisfies instead to be able to call a resolver directly in tests
