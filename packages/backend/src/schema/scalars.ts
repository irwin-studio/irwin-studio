import {gql} from 'apollo-server-cloudflare';
import {GraphQLScalarType, Kind} from 'graphql';

const typeDefs = gql`
    scalar Date
`;

const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        serialize: (value: string): number => new Date(value).getTime(),
        parseValue: (value: string): Date => new Date(value),
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
            }
            return null; // Invalid hard-coded value (not an integer)
        },
    }),
};

export default {typeDefs, resolvers};
