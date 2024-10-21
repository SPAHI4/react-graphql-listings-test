/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call */
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

const file_contents = await readFile('prisma/listings.csv', 'utf8');
const listings: any[] = parse(file_contents, {
  columns: true,
  skip_empty_lines: true,
});

await prisma.listing.createMany({
  data: listings.map((row: any) => ({
    id: row.id,
    listing_url: row.listing_url,
    name: row.name,
    description: row.description,
    picture_url: row.picture_url,
    host_id: parseInt(row.host_id),
    host_response_time: row.host_response_time || null,
    neighbourhood: row.neighbourhood,
    neighbourhood_cleansed: row.neighbourhood_cleansed,
    neighbourhood_group_cleansed: row.neighbourhood_group_cleansed || null,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    room_type: row.room_type,
    accommodates: parseInt(row.accommodates),
    bedrooms: row.bedrooms ? parseInt(row.bedrooms) : null,
    beds: row.beds ? parseInt(row.beds) : null,
    amenities: row.amenities,
    price: parseFloat(row.price.replace('$', '')),
    number_of_reviews: parseInt(row.number_of_reviews),
    review_scores_rating: row.review_scores_rating ? parseFloat(row.review_scores_rating) : null,
    review_scores_accuracy: row.review_scores_accuracy ? parseFloat(row.review_scores_accuracy) : null,
    review_scores_cleanliness: row.review_scores_cleanliness ? parseFloat(row.review_scores_cleanliness) : null,
    review_scores_checkin: row.review_scores_checkin ? parseFloat(row.review_scores_checkin) : null,
    review_scores_communication: row.review_scores_communication ? parseFloat(row.review_scores_communication) : null,
    review_scores_location: row.review_scores_location ? parseFloat(row.review_scores_location) : null,
    review_scores_value: row.review_scores_value ? parseFloat(row.review_scores_value) : null,
    reviews_per_month: row.reviews_per_month ? parseFloat(row.reviews_per_month) : null,
  })),
});
