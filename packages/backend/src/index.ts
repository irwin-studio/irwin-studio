import {apollo, playground} from './handlers';
import setCors from './utils/setCors';

const graphQLOptions = {
    baseEndpoint: '/',
    playgroundEndpoint: '/playground',
    forwardUnmatchedRequestsToOrigin: false,
    debug: process.env.NODE_ENV === 'development',
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
        const body = graphQLOptions.debug ? err : 'Something went wrong';
        return new Response(body, {status: 500});
    }
}

addEventListener('fetch', event => {
    const response = handleRequest(event.request);
    event.respondWith(response);
});
