import { useSuspenseQuery } from '@apollo/client';
import { truncateDescription } from '../utils/text';
import { gql as graphql } from '../__generated__';
import { useDeferredValue, useState, useTransition } from 'react';
import {
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  Skeleton,
  SimpleGrid,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Stack,
} from '@chakra-ui/react';

// eslint-disable-next-line react-refresh/only-export-components
export const GET_LISTINGS_QUERY = graphql(`
  query GetListings($offset: Int!, $limit: Int!, $search: String) {
    listings(offset: $offset, limit: $limit, search: $search) {
      nodes {
        id
        listing_url
        name
        description
        price
        neighbourhood_cleansed
        neighbourhood_score
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`);

export function ListingsPage() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  // const deferredSearch = useDeferredDebouncedValue(search, 500); // in case we want to debounce the search
  const { data, fetchMore } = useSuspenseQuery(GET_LISTINGS_QUERY, {
    variables: {
      offset: 0,
      limit: 12,
      search: deferredSearch,
    },
  });
  const [fetchMoreLoading, startTransition] = useTransition();
  const searchLoading = search !== deferredSearch;

  return (
    <>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Porto Listings
        </Heading>

        <Flex alignItems="center" gap={1}>
          <Input
            type="search"
            placeholder="Search for listings"
            value={search}
            size="lg"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <Spinner size="lg" ml={2} visibility={searchLoading ? 'visible' : 'hidden'} />
        </Flex>

        <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
          {data.listings.nodes.map((listing) => (
            <Card key={listing.id} borderRadius="lg">
              <CardHeader>
                <Heading size="md">
                  <Link href={listing.listing_url} isExternal>
                    {listing.name}
                  </Link>
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={2}>
                  <Text fontWeight="bold">
                    Price: {listing.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Text>
                  <Text>
                    <strong>Neighbourhood:</strong>
                    <br />
                    {listing.neighbourhood_cleansed} ({listing.neighbourhood_score?.toFixed(2) ?? 'N/A'})
                  </Text>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: truncateDescription(listing.description, 100),
                    }}
                  />
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Flex justify="center">
          {data.listings.pageInfo.hasNextPage && (
            <Button
              onClick={() => {
                startTransition(() => {
                  void fetchMore({
                    variables: {
                      offset: data.listings.nodes.length,
                    },
                  });
                });
              }}
              isLoading={fetchMoreLoading}
              loadingText="Loading more..."
            >
              Load more
            </Button>
          )}
        </Flex>
      </VStack>
    </>
  );
}

ListingsPage.Skeleton = function ListingsPageSkeleton() {
  return (
    <>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Porto Listings
        </Heading>
        <Skeleton height="48px" />
        <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
          {Array.from({ length: 5 }, (_, index) => (
            <Card key={index} borderRadius="lg">
              <CardHeader>
                <Skeleton height="20px" width="70%" />
              </CardHeader>
              <CardBody>
                <Stack spacing={2}>
                  <Skeleton height="16px" width="40%" />
                  <Skeleton height="16px" width="60%" />
                  <Skeleton height="48px" />
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </>
  );
};
