export class UrlHelpers {

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
                console.warn('Query value should not be an object', { name, value });
                return;
            }
            if (value === null || value === undefined) {
                console.warn('Query value should not be null or undefined', { name, value });
                return;
            }
            if (typeof value === 'string') {
                params.set(name, value);
            } else if (typeof value === 'number') {
                params.set(name, value.toString());
            } else if (typeof value === 'boolean') {
                params.set(name, value ? 'true' : 'false');
            } else {
                console.warn('Query value should be a string, number or boolean', { name, value });
                return;
            }
        });

        return params.toString()
    }
}