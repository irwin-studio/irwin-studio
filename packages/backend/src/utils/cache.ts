export default class KVCache {
    get(key: string) {
        return WORKERS_GRAPHQL_CACHE.get(key);
    }

    set(key: string, value: any, options: any) {
        const opts: any = {};
        const ttl = options && options.ttl;
        if (ttl) {
            opts.expirationTtl = ttl;
        }
        return WORKERS_GRAPHQL_CACHE.put(key, value, opts);
    }

    delete(key: string) {
        WORKERS_GRAPHQL_CACHE.delete(key);
    }
}
