import { parse } from 'csv-parse/sync';
import { readFile } from 'fs/promises';
import path from 'path';

export interface Listing {
  id: string;
  listing_url: string;
  name: string;
  description: string;
  review_scores_location: string;
  neighbourhood_cleansed: string;
  price: string;
}

let cachedListings: Listing[] | null = null;

export const listingsDb = {
  async getListings(): Promise<Listing[]> {
    if (!cachedListings) {
      const fileContents = await readFile(
        path.join(__dirname, 'listings.csv'),
        'utf8'
      );
      cachedListings = parse(fileContents, {
        columns: true,
        skip_empty_lines: true,
      }) as Listing[];
    }
    return cachedListings;
  },
};
