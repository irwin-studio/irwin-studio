import {apollo, playground} from './handlers';
import {DEFAULT_SERVER_CONFIGURATION} from './server';
import {isDebugRequest} from './utils/debug';
import setCors from './utils/setCors';

export const serverConfiguration = DEFAULT_SERVER_CONFIGURATION;

async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    try {
        if (url.pathname === serverConfiguration.baseEndpoint) {
            const response =
                request.method === 'OPTIONS'
                    ? new Response('', {status: 204})
                    : await apollo(request, serverConfiguration);

            if (serverConfiguration.cors) {
                setCors(response, serverConfiguration.cors);
            }

            return response;
        }

        if (
            serverConfiguration.playgroundEndpoint &&
            url.pathname === serverConfiguration.playgroundEndpoint
        ) {
            return playground(request, serverConfiguration);
        }

        if (serverConfiguration.forwardUnmatchedRequestsToOrigin) {
            return fetch(request);
        }

        return new Response('Not found', {status: 404});
    } catch (err) {
        // send error to logging service here

        // TODO: restrict debug header to only authorized requests
        const debug = serverConfiguration.debugMode && isDebugRequest(request);
        const body = debug ? err : 'Something went wrong';

        return new Response(body, {status: 500});
    }
}

addEventListener('fetch', event => {
    const response = handleRequest(event.request);
    event.respondWith(response);
});
