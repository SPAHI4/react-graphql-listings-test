export interface Listing {
  id: string;
  listing_url: string;
  name: string;
  description: string;
  price: string;
  neighbourhood_cleansed: string;
  neighbourhood_score?: number | null;
}
