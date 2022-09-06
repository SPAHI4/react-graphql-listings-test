import Layout from './components/Layout';
import ListingsPage from './pages/Listings.page';
import { ApolloProvider } from '@apollo/client';
import client from './services/apollo';

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <ListingsPage />
      </Layout>
    </ApolloProvider>
  );
}

export default App;
