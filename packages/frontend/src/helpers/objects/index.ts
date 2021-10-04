export function deepPreservativeMerge<T>(target: T, source: any): T {
    if (typeof target === 'object' && typeof source !== 'object') {
        return (Array.isArray(target) ? [...target] : {...target}) as T;
    }

    const final: any = {};

    Object.entries(target).forEach(([key, value]) => {
        const keyName = key as keyof T;

        if (typeof value !== 'object') {
            // update value
            if (source !== undefined && keyName in source) {
                final[keyName] = source[keyName];
            } else {
                final[keyName] = value;
            }
        } else {
            // array | object
            final[keyName] = deepPreservativeMerge(value, source?.[keyName]);
        }
    });

    return final as T;
}
