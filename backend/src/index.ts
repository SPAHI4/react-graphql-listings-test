import { createServer, useErrorHandler } from '@graphql-yoga/node';
import { resolvers, typeDefs } from './schema';

const server = createServer({
  port: 4001,
  schema: { typeDefs, resolvers },
  maskedErrors: false,
  plugins: [
    useErrorHandler((errors) => {
      errors.forEach((err) => console.error(err));
    }),
  ],
});

server.start().catch((err) => console.error(err));
