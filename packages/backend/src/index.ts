import {apollo, playground} from './handlers';
import {GqlHandlerOptions} from './types/handler';
import setCors from './utils/setCors';

const DEBUG_HEADER = 'debug-request';
export const isDebugRequest = (request: Request) => {
    return request.headers.get(DEBUG_HEADER) === 'true';
};

const graphQLOptions: GqlHandlerOptions = {
    baseEndpoint: '/',
    playgroundEndpoint: '/playground',
    forwardUnmatchedRequestsToOrigin: false,
    allowDebug: !!process.env.ALLOW_DEBUG,
    cors: true,
    kvCache: false,
};

async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    try {
        if (url.pathname === graphQLOptions.baseEndpoint) {
            const response =
                request.method === 'OPTIONS'
                    ? new Response('', {status: 204})
                    : await apollo(request, graphQLOptions);

            if (graphQLOptions.cors) {
                setCors(response, graphQLOptions.cors);
            }

            return response;
        }

        if (
            graphQLOptions.playgroundEndpoint &&
            url.pathname === graphQLOptions.playgroundEndpoint
        ) {
            return playground(request, graphQLOptions);
        }

        if (graphQLOptions.forwardUnmatchedRequestsToOrigin) {
            return fetch(request);
        }

        return new Response('Not found', {status: 404});
    } catch (err) {
        // send error to logging service here

        // TODO: restrict debug header to only authorized requests
        const debug = graphQLOptions.allowDebug && isDebugRequest(request);
        const body = debug ? err : 'Something went wrong';

        return new Response(body, {status: 500});
    }
}

addEventListener('fetch', event => {
    const response = handleRequest(event.request);
    event.respondWith(response);
});
