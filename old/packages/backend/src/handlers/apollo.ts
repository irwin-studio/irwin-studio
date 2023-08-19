import {graphqlCloudflare} from 'apollo-server-cloudflare/dist/cloudflareApollo';
import {createServer, ServerConfiguration} from '../server';
import {isDebugRequest} from '../utils/debug';

export default (request: Request, serverConfiguration: ServerConfiguration): Response => {
    const server = createServer({
        ...serverConfiguration,
        debugMode: serverConfiguration.debugMode && isDebugRequest(request),
    });
    // @ts-ignore
    return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request);
};
