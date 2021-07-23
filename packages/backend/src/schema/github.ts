import {gql} from 'apollo-server-cloudflare';
import {getGithubStats} from '../helpers/github';
import {Context} from '../types/context';
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
        githubStats: async (_, __, {DEBUG}: Context): Promise<GithubStats> => {
            try {
                return await getGithubStats();
            } catch (ex) {
                if (DEBUG) throw ex;
                else throw new Error('Failed to get github information');
            }
        },
    },
};

export default {resolvers, typeDefs};
