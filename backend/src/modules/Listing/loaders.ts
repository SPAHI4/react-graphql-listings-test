import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

const minimumScoreCount = 5;

// could be implemented with materialized views instead (not supported by Prisma yet)
export function createNeighborhoodScoreLoader(prisma: PrismaClient) {
  return new DataLoader<string, number | null, string>(
    async (neighborhoods) => {
      const results = await prisma.listing.groupBy({
        by: ['neighbourhood_cleansed'],
        where: {
          neighbourhood_cleansed: { in: neighborhoods as string[] },
          review_scores_location: { not: null },
        },
        _avg: {
          review_scores_location: true,
        },
        _count: {
          review_scores_location: true,
        },
        having: {
          review_scores_location: { _count: { gte: minimumScoreCount } },
        },
      });

      const scoreMap = new Map(
        results.map(({ neighbourhood_cleansed, _avg }) => [neighbourhood_cleansed, _avg.review_scores_location]),
      );

      return neighborhoods.map((neighborhood) => scoreMap.get(neighborhood) ?? null);
    },
    {
      cacheKeyFn: (key) => key,
    },
  );
}
