const DEBUG_HEADER = 'debug-request';
export const isDebugRequest = (request: Request) => {
    return request.headers.get(DEBUG_HEADER) === 'true';
};
