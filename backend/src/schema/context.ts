import { prisma } from '../services/prisma.js';
import { createNeighborhoodScoreLoader } from '../modules/Listing/index.js';

export interface GraphQLContext {
  prisma: typeof prisma;
  neighborhoodScoreLoader: ReturnType<typeof createNeighborhoodScoreLoader>;
}
