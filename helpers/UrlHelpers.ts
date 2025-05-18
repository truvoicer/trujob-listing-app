

export class UrlHelpers {
    static getSearchParams(searchParams: URLSearchParams, keys?: Array<string>): Record<string, string>
     {
        if (!Array.isArray(keys)) {
            return Object.fromEntries(searchParams.entries())
        }
        const filteredKeys = keys.filter((key) => searchParams.has(key));
        if (filteredKeys.length === 0) {
            return {};
        }
        const filteredParams: Record<string, string> = {};
        filteredKeys.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                filteredParams[key] = value;
            }
        });
        return filteredParams;
    }
    static getRedirectUrl(
        searchParams: URLSearchParams,
        fallback: string
    ) {
        const redirect = searchParams.get('redirect');
        if (redirect) {
            return `${redirect}`;
        }
        return fallback;
    }
    static createQueryString(
        searchParams: URLSearchParams,
        query: Array<{
            name: string;
            value: string | number | boolean | null | undefined;
        }> = []
    ) {
        const params = new URLSearchParams(searchParams.toString())
        if (query.length === 0) {
            return params.toString()
        }
        query.forEach(({ name, value }) => {
            if (typeof value === 'object') {
                console.log('Query value should not be an object', { name, value });
                return;
            }
            if (value === null || value === undefined) {
                console.log('Query value should not be null or undefined', { name, value });
                return;
            }
            if (typeof value === 'string') {
                params.set(name, value);
            } else if (typeof value === 'number') {
                params.set(name, value.toString());
            } else if (typeof value === 'boolean') {
                params.set(name, value ? 'true' : 'false');
            } else {
                console.log('Query value should be a string, number or boolean', { name, value });
                return;
            }
        });

        return params.toString()
    }

    static urlFromArray(
        array: Array<string | number>,
        separator: string = '/'
    ) {
        if (array.length === 0) {
            return '';
        }
        return array.map((item) => {
            if (typeof item === 'string') {
                return item;
            } else if (typeof item === 'number') {
                return item.toString();
            } else {
                console.log('Array item should be a string or number', { item });
                return '';
            }
        }).join(separator);
    }
}