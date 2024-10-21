import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { apolloClient } from './services/apollo.ts';
import { ListingsPage } from './pages/Listings.page.tsx';
import { Layout } from './components/Layout.tsx';

function fallbackRender({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{(error as Error).message}</pre>
    </div>
  );
}

export function App() {
  return (
    <ChakraProvider>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Suspense fallback={<ListingsPage.Skeleton />}>
              <ListingsPage />
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </ApolloProvider>
    </ChakraProvider>
  );
}
