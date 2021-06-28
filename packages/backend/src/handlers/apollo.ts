import {ApolloServer, Config} from 'apollo-server-cloudflare';
import {graphqlCloudflare} from 'apollo-server-cloudflare/dist/cloudflareApollo';

import KVCache from '../cache';
import {GqlHandlerOptions} from './handler.types';
import {typeDefs, resolvers} from '../schema';

const dataSources = () => ({});

const createServer = (graphQLOptions: GqlHandlerOptions) =>
    new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        // @ts-ignore
        dataSources,
        ...(graphQLOptions.kvCache ? {cache: new KVCache()} : {}),
    } as Config);

export default (request: Request, graphQLOptions: GqlHandlerOptions): Response => {
    const server = createServer(graphQLOptions);

    // @ts-ignore
    return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request);
};
