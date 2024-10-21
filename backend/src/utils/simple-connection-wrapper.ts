export interface ConnectionResult<TNodes> {
  nodes: TNodes[];
  pageInfo: {
    hasNextPage: boolean;
  };
}

// use simple connection for offset/limit pagination instead of normal relay/cursor connection
export function simpleConnectionWrapper<TNodes>(nodes: TNodes[], limit: number): ConnectionResult<TNodes> {
  const hasNextPage = nodes.length > limit;
  return {
    nodes: nodes.slice(0, limit),
    pageInfo: {
      hasNextPage,
    },
  };
}
