import {gql} from 'apollo-server-cloudflare';
import {getGithubStats} from '../helpers/github';
import {GithubStats} from '../types/github';

const typeDefs = gql`
    extend type Query {
        githubStats: GithubStats
    }

    type GithubStats {
        username: String!
        contributions: Commits!
    }

    type Commits {
        total: Int!
        commits: [Int!]!
        from: Date!
        to: Date!
    }
`;

const resolvers = {
    Query: {
        githubStats: async (): Promise<GithubStats> => {
            return getGithubStats();
        },
    },
};

export default {resolvers, typeDefs};
