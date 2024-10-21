import { FieldPolicy } from '@apollo/client/cache';

// source: https://github.com/apollographql/apollo-client/blob/main/src/utilities/policies/pagination.ts
// modified for connection object
type KeyArgs = FieldPolicy<unknown>['keyArgs'];
export function offsetLimitPaginationWithConnectionObject<
  TNode,
  TConnection extends {
    nodes: TNode[];
  },
>(keyArgs: KeyArgs = false): FieldPolicy<TConnection> {
  return {
    keyArgs,

    merge(existing, incoming, { args }) {
      const merged = existing ? existing.nodes.slice(0) : [];

      if (incoming) {
        if (args) {
          // Assume an offset of 0 if args.offset omitted.
          const { offset = 0 } = args;
          for (let i = 0; i < incoming.nodes.length; ++i) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            merged[offset + i] = incoming.nodes[i];
          }
        } else {
          // It's unusual (probably a mistake) for a paginated field not
          // to receive any arguments, so you might prefer to throw an
          // exception here, instead of recovering by appending incoming
          // onto the existing array.
          merged.push(...incoming.nodes);
        }
      }

      return {
        ...incoming,
        nodes: merged,
      };
    },
  };
}
