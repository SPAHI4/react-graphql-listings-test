import { describe, expect, it } from 'vitest';
import { getPrismaSelectFromInfo } from './get-prisma-select.js';
import { FragmentDefinitionNode, GraphQLResolveInfo, Kind, OperationTypeNode, SelectionSetNode } from 'graphql';

describe('getPrismaSelectFromInfo', () => {
  const mockScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
  };

  function createMockInfo(
    selections: SelectionSetNode['selections'],
    fragments: Record<string, FragmentDefinitionNode> = {},
  ): GraphQLResolveInfo {
    return {
      fieldNodes: [
        {
          kind: Kind.FIELD,
          name: { kind: Kind.NAME, value: 'mockRootField' },
          selectionSet: { kind: Kind.SELECTION_SET, selections },
        },
      ],
      fragments,
      operation: {
        kind: Kind.OPERATION_DEFINITION,
        operation: OperationTypeNode.QUERY,
        selectionSet: { kind: Kind.SELECTION_SET, selections: [] },
      },
      variableValues: {},
      fieldName: 'mockRootField',
    } as unknown as GraphQLResolveInfo;
  }

  it('should select fields present in the GraphQL query', () => {
    const mockInfo = createMockInfo([
      { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'id' } },
      { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'name' } },
    ]);

    const result = getPrismaSelectFromInfo(mockScalarFieldEnum, mockInfo);

    expect(result).toEqual({
      id: true,
      name: true,
    });
  });

  it('should handle fragment spreads', () => {
    const fragments = {
      UserFields: {
        kind: Kind.FRAGMENT_DEFINITION,
        name: { kind: Kind.NAME, value: 'UserFields' },
        typeCondition: { kind: Kind.NAMED_TYPE, name: { kind: Kind.NAME, value: 'User' } },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [
            { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'name' } },
            { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'email' } },
          ],
        },
      } as FragmentDefinitionNode,
    };

    const mockInfo = createMockInfo(
      [
        { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'id' } },
        { kind: Kind.FRAGMENT_SPREAD, name: { kind: Kind.NAME, value: 'UserFields' } },
      ],
      fragments,
    );

    const result = getPrismaSelectFromInfo(mockScalarFieldEnum, mockInfo);

    expect(result).toEqual({
      id: true,
      name: true,
      email: true,
    });
  });

  it('should handle inline fragments', () => {
    const mockInfo = createMockInfo([
      { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'id' } },
      {
        kind: Kind.INLINE_FRAGMENT,
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [{ kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'email' } }],
        },
      },
    ]);

    const result = getPrismaSelectFromInfo(mockScalarFieldEnum, mockInfo);

    expect(result).toEqual({
      id: true,
      email: true,
    });
  });

  it('should ignore fields not present in scalarFieldEnum', () => {
    const mockInfo = createMockInfo([
      { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'id' } },
      { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'nonExistentField' } },
    ]);

    const result = getPrismaSelectFromInfo(mockScalarFieldEnum, mockInfo);

    expect(result).toEqual({
      id: true,
    });
  });
});
