import {ApolloServer} from 'apollo-server-cloudflare';
import {typeDefs, resolvers} from './schema';
import {Context} from './types/context';

export interface ServerConfiguration {
    baseEndpoint: string;
    playgroundEndpoint: string;
    forwardUnmatchedRequestsToOrigin: boolean;
    debugMode: boolean;
    enableIntrospection: boolean;
    cors: boolean | object; // TODO: type this
    kvCache: boolean;
}

export const DEFAULT_SERVER_CONFIGURATION: ServerConfiguration = {
    baseEndpoint: '/',
    playgroundEndpoint: '/playground',
    forwardUnmatchedRequestsToOrigin: false,
    debugMode: !!process.env.ALLOW_DEBUG,
    enableIntrospection: true,
    cors: true,
    kvCache: false,
};

export const createServer = (configuration: ServerConfiguration) => {
    const context: Context = {
        debug: configuration.debugMode,
    };

    return new ApolloServer({
        typeDefs,
        resolvers,
        introspection: configuration.enableIntrospection,
        context,
    });
};
