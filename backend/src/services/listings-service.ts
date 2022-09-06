import { Listing, listingsDb } from '../data/db';

export interface GetListingsOptions {
  limit: number;
}

export async function getListings({
  limit,
}: GetListingsOptions): Promise<Listing[]> {
  const listings = await listingsDb.getListings();
  return listings.slice(0, limit);
}
