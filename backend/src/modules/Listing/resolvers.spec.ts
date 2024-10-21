/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvers } from './resolvers.js';
import { prisma } from '../../services/prisma.js';
import { Prisma } from '@prisma/client';
import { getPrismaSelectFromInfo } from '../../utils/get-prisma-select.js';
import { simpleConnectionWrapper } from '../../utils/simple-connection-wrapper.js';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '../../schema/context.js';

// this file contains a lot of as unknown as assertions to cut down on the amount of code needed to mock the context

vi.mock('../../utils/get-prisma-select', () => ({
  getPrismaSelectFromInfo: vi.fn(),
}));

vi.mock('../../utils/simple-connection-wrapper', () => ({
  simpleConnectionWrapper: vi.fn(),
}));

const mockListings: Prisma.ListingGetPayload<object>[] = [
  {
    id: '1',
    name: 'Listing 1',
    listing_url: '',
    description: '',
    picture_url: '',
    host_id: 0,
    host_response_time: null,
    neighbourhood: '',
    neighbourhood_cleansed: 'Downtown',
    neighbourhood_group_cleansed: null,
    latitude: 0,
    longitude: 0,
    room_type: '',
    accommodates: 0,
    bedrooms: null,
    beds: null,
    amenities: null,
    price: 0,
    number_of_reviews: 0,
    review_scores_rating: null,
    review_scores_accuracy: null,
    review_scores_cleanliness: null,
    review_scores_checkin: null,
    review_scores_communication: null,
    review_scores_location: null,
    review_scores_value: null,
    reviews_per_month: null,
  },
  {
    id: '2',
    name: 'Listing 2',
    listing_url: '',
    description: '',
    picture_url: '',
    host_id: 0,
    host_response_time: null,
    neighbourhood: '',
    neighbourhood_cleansed: '',
    neighbourhood_group_cleansed: null,
    latitude: 0,
    longitude: 0,
    room_type: '',
    accommodates: 0,
    bedrooms: null,
    beds: null,
    amenities: null,
    price: 0,
    number_of_reviews: 0,
    review_scores_rating: null,
    review_scores_accuracy: null,
    review_scores_cleanliness: null,
    review_scores_checkin: null,
    review_scores_communication: null,
    review_scores_location: null,
    review_scores_value: null,
    reviews_per_month: null,
  },
];

describe('listings resolver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch listings with correct parameters', async () => {
    vi.spyOn(prisma.listing, 'findMany').mockResolvedValue(mockListings);
    vi.mocked(getPrismaSelectFromInfo).mockReturnValue({ id: true, name: true });
    vi.mocked(simpleConnectionWrapper).mockReturnValue({
      nodes: mockListings,
      pageInfo: { hasNextPage: false },
    });

    const result = await resolvers.Query.listings(
      {},
      { limit: 10, offset: 0, search: null },
      { prisma } as GraphQLContext,
      {} as GraphQLResolveInfo,
    );

    expect(vi.mocked(prisma.listing.findMany)).toHaveBeenCalledWith({
      where: {},
      take: 11,
      skip: 0,
      select: { id: true, name: true, neighbourhood_cleansed: true },
    });
    expect(simpleConnectionWrapper).toHaveBeenCalledWith(mockListings, 10);
    expect(result).toEqual({
      nodes: mockListings,
      pageInfo: { hasNextPage: false },
    });
  });

  it('should apply search filter when provided', async () => {
    vi.spyOn(prisma.listing, 'findMany').mockResolvedValue(mockListings);
    vi.mocked(getPrismaSelectFromInfo).mockReturnValue({ id: true, name: true });
    vi.mocked(simpleConnectionWrapper).mockReturnValue({
      nodes: mockListings,
      pageInfo: { hasNextPage: false },
    });

    await resolvers.Query.listings(
      {},
      { limit: 10, offset: 0, search: 'Test' },
      { prisma } as GraphQLContext,
      {} as GraphQLResolveInfo,
    );

    expect(prisma.listing.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: 'Test', mode: 'insensitive' } },
          { description: { contains: 'Test', mode: 'insensitive' } },
          { neighbourhood_cleansed: { contains: 'Test', mode: 'insensitive' } },
        ],
      },
      take: 11,
      skip: 0,
      select: { id: true, name: true, neighbourhood_cleansed: true },
    });
  });

  it('should fetch neighbourhood score using dataloader', async () => {
    const mockNeighborhoodScoreLoader = {
      load: vi.fn().mockResolvedValue(4.5),
    };

    const result = await resolvers.Listing.neighbourhood_score(mockListings[0], {}, {
      neighborhoodScoreLoader: mockNeighborhoodScoreLoader,
    } as unknown as GraphQLContext);

    expect(mockNeighborhoodScoreLoader.load).toHaveBeenCalledWith('Downtown');
    expect(result).toBe(4.5);
  });
});
