import {ApolloServer, Config as Config} from 'apollo-server-cloudflare';
import {graphqlCloudflare} from 'apollo-server-cloudflare/dist/cloudflareApollo';
import {Context} from '../types/context';
import KVCache from '../cache';
import {GqlHandlerOptions} from '../types/handler';
import {typeDefs, resolvers} from '../schema';
import {isDebugRequest} from '..';

const dataSources = () => ({});

const createServer = (graphQLOptions: GqlHandlerOptions, debug: boolean) => {
    const context: Context = {
        DEBUG: debug,
    };

    return new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        dataSources,
        ...(graphQLOptions.kvCache ? {cache: new KVCache()} : {}),
        context,
    } as Config);
};

export default (request: Request, graphQLOptions: GqlHandlerOptions): Response => {
    const debug = graphQLOptions.allowDebug && isDebugRequest(request);
    const server = createServer(graphQLOptions, debug);

    // @ts-ignore
    return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request);
};
