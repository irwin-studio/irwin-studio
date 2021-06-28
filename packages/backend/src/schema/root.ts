import {gql} from 'apollo-server-cloudflare';
import pkg from '../../package.json';

const typeDefs = gql`
    type Query {
        version: String!
    }
`;

const resolvers = {
    Query: {
        version() {
            return pkg.version;
        },
    },
};

export default {resolvers, typeDefs};
