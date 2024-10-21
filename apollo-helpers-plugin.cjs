/* eslint-disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.plugin = void 0;
const path_1 = require("path");
const graphql_1 = require("graphql");
const incorrectTypes = {
    excludeAggregations: 'ExcludeAggregations',
    pf: 'Pf',
};
const plugin = (schema, documents, config) => {
    const results = [];
    results.push(generateTypePoliciesSignature(schema, config));
    return {
        prepend: results.reduce((prev, r) => [...prev, ...(r.prepend ?? [])], []),
        append: results.reduce((prev, r) => [...prev, ...(r.append ?? [])], []),
        content: results.map((r) => r.content).join('\n'),
    };
};
exports.plugin = plugin;
function generateTypePoliciesSignature(schema, config) {
    const typeMap = schema.getTypeMap();
    const perTypePolicies = [];
    const typedTypePolicies = Object.keys(typeMap).reduce((prev, typeName) => {
        const type = typeMap[typeName];
        if (!typeName.startsWith('__') && ((0, graphql_1.isObjectType)(type) || (0, graphql_1.isInterfaceType)(type))) {
            const fieldsNames = Object.keys(type.getFields()).filter((f) => !f.startsWith('__'));
            const keySpecifierVarName = `${typeName}KeySpecifier`;
            const fieldPolicyVarName = `${typeName}FieldPolicy`;
            perTypePolicies.push(`export type ${keySpecifierVarName} = (${fieldsNames
                .map((f) => `'${f}'`)
                .join(' | ')} | ${keySpecifierVarName})[];`);
            const fieldPolicies = fieldsNames
                .map((fieldName) => {
                // const fieldType = `GraphQLTypes.${typeName}['${fieldName}'] | Reference`;
                const fieldType = `GraphQLTypes.${typeName}['${fieldName}']`;
                return `\t${fieldName}?: FieldPolicy<${fieldType}> | FieldReadFunction<${fieldType}>`;
            })
                .join(',\n');
            perTypePolicies.push(`export type ${fieldPolicyVarName} = {\n${fieldPolicies}\n};`);
            return {
                ...prev,
                [typeName]: `Omit<TypePolicy, "fields" | "keyFields"> & {
\t\tkeyFields${config.requireKeyFields ? '' : '?'}: false | ${keySpecifierVarName} | (() => undefined | ${keySpecifierVarName}),
\t\tfields?: ${fieldPolicyVarName},
\t}`,
            };
        }
        return prev;
    }, {});
    const rootTypes = [
        schema.getQueryType()?.name,
        schema.getMutationType()?.name,
        schema.getSubscriptionType()?.name,
    ].filter(Boolean);
    const rootContent = `export type StrictTypedTypePolicies = {${Object.keys(typedTypePolicies)
        .map((typeName) => {
        const nonOptional = config.requirePoliciesForAllTypes && !rootTypes.includes(typeName);
        return `\n\t${typeName}${nonOptional ? '' : '?'}: ${typedTypePolicies[typeName]}`;
    })
        .join(',')}\n};\nexport type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;`;
    return {
        prepend: [
            `/* eslint-ignore */ \nimport ${config.useTypeImports ? 'type ' : ''}{ FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';`,
            `import * as GraphQLTypes from './graphql.js';`,
        ],
        content: [...perTypePolicies, rootContent]
            .join('\n')
            // fixes issue with incorrect casing in our schema
            .replace(new RegExp(`GraphQLTypes\\.(${Object.keys(incorrectTypes).join('|')})`, 'g'), 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (match, p1) => `GraphQLTypes.${incorrectTypes[p1]}`),
    };
}
const validate = (schema, documents, config, outputFile) => {
    if ((0, path_1.extname)(outputFile) !== '.ts' && (0, path_1.extname)(outputFile) !== '.tsx') {
        throw new Error(`Plugin "apollo-client-helpers" requires extension to be ".ts" or ".tsx"!`);
    }
};
exports.validate = validate;
