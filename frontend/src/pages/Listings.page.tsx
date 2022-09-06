import { gql, useQuery } from '@apollo/client';
import Spinner from '../components/Spinner';
import { Listing } from '../types/listings';
import { truncateDescription } from '../utils/text';

import './Listings.page.css';

const GET_LISTINGS = gql`
  query GetListings {
    listings(limit: 10) {
      id
      listing_url
      name
      description
      price
      neighbourhood_cleansed
      neighbourhood_score
    }
  }
`;

function ListingsPage(): JSX.Element {
  const { error, data } = useQuery<{ listings: Listing[] }>(GET_LISTINGS);

  if (!data) {
    if (error) {
      return <h2>Error: {error.message}</h2>;
    }
    return <Spinner />;
  }

  return (
    <div>
      <h1>Porto Listings</h1>
      <input
        type="text"
        className="search-box"
        placeholder="Search for listings"
      />
      {data.listings.map((listing) => (
        <div key={listing.id}>
          <h2>
            <a href={listing.listing_url}>{listing.name}</a>
          </h2>
          <p>
            <strong>Price:</strong>&nbsp;{listing.price}
          </p>
          <p>
            <strong>Neighbourhood:</strong>
            <br />
            {listing.neighbourhood_cleansed} (
            {listing.neighbourhood_score || 'N/A'})
          </p>
          <p
            className="description"
            dangerouslySetInnerHTML={{
              __html: truncateDescription(listing.description, 100),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ListingsPage;
