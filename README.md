# Run the project
1. Start docker
2. 
```bash
$ corepack enable pnpm # if you don't have pnpm installed
$ pnpm install
$ pnpm --filter backend docker:up
```
3.
```bash
$ pnpm --filter backend init-db
$ pnpm dev
```
## test
```bash
pnpm test
```

# My steps:

## Tools setup
- set up a monorepo instead of two separate repos, used pnpm as a package manager
- set up upgraded eslint with a flat configuration which suits a monorepo, used recommended type checking rules
- set up upgraded typescript with referenced projects which suits a monorepo
- replaced CRA with vite
- set up vitest which is a superior to jest with workspaces support
- Most important: set up `graphql-codegen`, as we have graphql in the project, it's a must to have types generated for both client and server

## Backend
- I was told that Prisma is preferred, so I installed it and set up the database. I chose Postgres, so I added docker-compose as well
- Added indexes: `gin` index for the search and `btree` index for the neighborhood score, even though query planner won't use them for a data set of this size
- Used DataLoader for `neighborhood_score` resolver, so it doesn't make a separate query for each listing
  - Alternative 1: within a single query with `prisma.$queryRaw` (not type safe, no lazy loading, almost the same performance)
  - Alternative 2: view/materialized view (more complex; materialized views are not supported by Prisma so it would be a normal table (model) updated periodically, but it is the most efficient way)
- Added a couple unit tests for the resolvers and utils

## Frontend
- I was told that Chakra UI is preferred, so I installed it
- Used Apollo Client for fetching data
- No throttling was implemented for the search, built-in `useDeferredValue` handles UI updates properly
- Implemented pagination in Apollo type policies. Used `fetchMore` for fetching more data. Pagination is the same as in the original project, which uses `limit` and `offset` for fetching data. 
As an alternative, I would use Relay style (cursor-based pagination), there is a ready solution for that in both Apollo Client and Prisma (third-party library)
- Added a unit test for the listings page