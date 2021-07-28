import {ApolloServer, gql} from 'apollo-server-cloudflare';

/* This package is not explicitly defined as a dependency but is a dependency of another
 * However, adding this package to the project will result in a multitude of TypeScript errors
 */
import {GraphQLResponse, VariableValues} from 'apollo-server-types';

type QueryMethod = (queryString: string, variables?: VariableValues) => Promise<GraphQLResponse>;

export const getQueryMethod = (server: ApolloServer): QueryMethod => {
    return (queryString: string, variables?: VariableValues) => {
        return server.executeOperation({
            query: gql`
                ${queryString}
            `,
            variables,
        });
    };
};
