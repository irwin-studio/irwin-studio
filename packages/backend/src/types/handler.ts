export interface GqlHandlerOptions {
    baseEndpoint: string;
    playgroundEndpoint: string;
    forwardUnmatchedRequestsToOrigin: boolean;
    allowDebug: boolean;
    cors: boolean | object; // TODO: type this
    kvCache: boolean;
}
