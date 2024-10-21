import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4001/graphql',
  generates: {
    // Backend configuration
    'backend/src/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useIndexSignature: true,
        contextType: '../schema/context.js#GraphQLContext',
      },
    },

    // Frontend configuration
    'frontend/src/__generated__/': {
      documents: 'frontend/src/**/*.tsx',
      preset: 'client',
      plugins: ['typescript'],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },

    // generate type policies for apollo client
    'frontend/src/__generated__/apollo-helpers.ts': {
      plugins: ['apollo-helpers-plugin.cjs'],
      config: {
        requireKeyFields: false,
      },
    },
  },
};

export default config;
