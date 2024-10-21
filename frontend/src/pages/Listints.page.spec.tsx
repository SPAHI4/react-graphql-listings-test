import { describe, it, expect, afterEach } from 'vitest';
import { PropsWithChildren, Suspense } from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ListingsPage, GET_LISTINGS_QUERY } from './Listings.page.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import { InMemoryCache } from '@apollo/client';
import { typePolicies } from '../services/apollo.ts';

const createListingMock = (offset: number, search: string, hasNextPage: boolean) => ({
  request: {
    query: GET_LISTINGS_QUERY,
    variables: { offset, limit: 12, search },
  },
  result: {
    data: {
      listings: {
        nodes: Array.from({ length: 3 }, (_, index) => ({
          id: `${offset + index + 1}`,
          listing_url: `http://example.com/${offset + index + 1}`,
          name: `Test Listing ${offset + index + 1}${search ? ' (Search)' : ''}`,
          description: 'A nice place to stay',
          price: 100 + offset + index,
          neighbourhood_cleansed: `Test Neighbourhood ${offset + index + 1}`,
          neighbourhood_score: 4.5,
        })),
        pageInfo: {
          hasNextPage,
        },
      },
    },
  },
});

const initialLoadMock = createListingMock(0, '', true);
const loadMoreMock = createListingMock(3, '', false);
const searchMock = createListingMock(0, 'search term', false);

const cache = new InMemoryCache({ addTypename: false, typePolicies });

const wrapper = ({ children }: PropsWithChildren) => (
  <ChakraProvider>
    <Suspense fallback="Loading">
      <MockedProvider cache={cache} mocks={[initialLoadMock, loadMoreMock, searchMock]} addTypename={false}>
        {children}
      </MockedProvider>
    </Suspense>
  </ChakraProvider>
);

describe('ListingsPage', () => {
  afterEach(async () => {
    cleanup();
    await cache.reset();
  });

  it('renders the page title', async () => {
    render(<ListingsPage />, { wrapper });
    expect(await screen.findByText('Porto Listings')).toBeInTheDocument();
  });

  it('renders the search input', async () => {
    render(<ListingsPage />, { wrapper });
    expect(await screen.findByPlaceholderText('Search for listings')).toBeInTheDocument();
  });

  it('renders initial listing data', async () => {
    render(<ListingsPage />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument();
      expect(screen.getByText('Price: $100.00')).toBeInTheDocument();
      expect(screen.getByText('Test Neighbourhood 1 (4.50)')).toBeInTheDocument();
    });
  });

  it('updates search input value', async () => {
    render(<ListingsPage />, { wrapper });
    const searchInput = await screen.findByPlaceholderText('Search for listings');
    fireEvent.change(searchInput, { target: { value: 'New search' } });
    expect(searchInput).toHaveValue('New search');
  });

  it('fetches more listings when "Load more" is clicked', async () => {
    render(<ListingsPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByText('Load more');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText('Test Listing 4')).toBeInTheDocument();
    });

    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  });

  it('refetches listings when search term changes', async () => {
    render(<ListingsPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Listing 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search for listings');
    fireEvent.change(searchInput, { target: { value: 'search term' } });
    await waitFor(() => {
      expect(screen.getByText('Test Listing 1 (Search)')).toBeInTheDocument();
    });
  });
});
