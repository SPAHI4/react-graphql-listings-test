/* eslint-disable */ 

/* eslint-ignore */ 
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
import * as GraphQLTypes from './graphql.js';
export type ListingKeySpecifier = ('description' | 'foo' | 'id' | 'listing_url' | 'name' | 'neighbourhood' | 'neighbourhood_cleansed' | 'neighbourhood_score' | 'price' | ListingKeySpecifier)[];
export type ListingFieldPolicy = {
	description?: FieldPolicy<GraphQLTypes.Listing['description']> | FieldReadFunction<GraphQLTypes.Listing['description']>,
	foo?: FieldPolicy<GraphQLTypes.Listing['foo']> | FieldReadFunction<GraphQLTypes.Listing['foo']>,
	id?: FieldPolicy<GraphQLTypes.Listing['id']> | FieldReadFunction<GraphQLTypes.Listing['id']>,
	listing_url?: FieldPolicy<GraphQLTypes.Listing['listing_url']> | FieldReadFunction<GraphQLTypes.Listing['listing_url']>,
	name?: FieldPolicy<GraphQLTypes.Listing['name']> | FieldReadFunction<GraphQLTypes.Listing['name']>,
	neighbourhood?: FieldPolicy<GraphQLTypes.Listing['neighbourhood']> | FieldReadFunction<GraphQLTypes.Listing['neighbourhood']>,
	neighbourhood_cleansed?: FieldPolicy<GraphQLTypes.Listing['neighbourhood_cleansed']> | FieldReadFunction<GraphQLTypes.Listing['neighbourhood_cleansed']>,
	neighbourhood_score?: FieldPolicy<GraphQLTypes.Listing['neighbourhood_score']> | FieldReadFunction<GraphQLTypes.Listing['neighbourhood_score']>,
	price?: FieldPolicy<GraphQLTypes.Listing['price']> | FieldReadFunction<GraphQLTypes.Listing['price']>
};
export type ListingConnectionKeySpecifier = ('nodes' | 'pageInfo' | ListingConnectionKeySpecifier)[];
export type ListingConnectionFieldPolicy = {
	nodes?: FieldPolicy<GraphQLTypes.ListingConnection['nodes']> | FieldReadFunction<GraphQLTypes.ListingConnection['nodes']>,
	pageInfo?: FieldPolicy<GraphQLTypes.ListingConnection['pageInfo']> | FieldReadFunction<GraphQLTypes.ListingConnection['pageInfo']>
};
export type PageInfoKeySpecifier = ('hasNextPage' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	hasNextPage?: FieldPolicy<GraphQLTypes.PageInfo['hasNextPage']> | FieldReadFunction<GraphQLTypes.PageInfo['hasNextPage']>
};
export type QueryKeySpecifier = ('listings' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	listings?: FieldPolicy<GraphQLTypes.Query['listings']> | FieldReadFunction<GraphQLTypes.Query['listings']>
};
export type StrictTypedTypePolicies = {
	Listing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ListingKeySpecifier | (() => undefined | ListingKeySpecifier),
		fields?: ListingFieldPolicy,
	},
	ListingConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ListingConnectionKeySpecifier | (() => undefined | ListingConnectionKeySpecifier),
		fields?: ListingConnectionFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;