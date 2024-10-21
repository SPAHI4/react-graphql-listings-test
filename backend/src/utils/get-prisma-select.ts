import { GraphQLResolveInfo, visit, FieldNode, FragmentSpreadNode, InlineFragmentNode } from 'graphql';

export const getPrismaSelectFromInfo = <TSelectEnum extends Record<string, string>>(
  scalarFieldEnum: TSelectEnum,
  info: GraphQLResolveInfo,
): Record<keyof TSelectEnum, boolean> => {
  const scalarFields = new Set(Object.values(scalarFieldEnum));
  const select: Record<string, boolean> = {};

  const visitor = {
    Field(node: FieldNode) {
      const fieldName = node.name.value;
      if (scalarFields.has(fieldName)) {
        select[fieldName] = true;
      }
    },
    FragmentSpread(node: FragmentSpreadNode) {
      const fragment = info.fragments[node.name.value];
      if (fragment) {
        visit(fragment, visitor);
      }
    },
    InlineFragment(node: InlineFragmentNode) {
      visit(node.selectionSet, visitor);
    },
  };

  info.fieldNodes.forEach((fieldNode) => {
    if (fieldNode.selectionSet) {
      visit(fieldNode.selectionSet, visitor);
    }
  });

  return select as Record<keyof TSelectEnum, boolean>;
};
