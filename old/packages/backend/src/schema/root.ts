import {gql} from 'apollo-server-cloudflare';
import {Version} from '../types/root';
const pkg = require('../../package.json');

const typeDefs = gql`
    type Query {
        version: String!
    }
`;

const resolvers = {
    Query: {
        version(): Version {
            return pkg.version;
        },
    },
};

export default {resolvers, typeDefs};
