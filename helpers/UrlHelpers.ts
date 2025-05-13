import { DebugHelpers } from "./DebugHelpers";

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
                DebugHelpers.log(DebugHelpers.WARN, 'Query value should not be an object', { name, value });
                return;
            }
            if (value === null || value === undefined) {
                DebugHelpers.log(DebugHelpers.WARN, 'Query value should not be null or undefined', { name, value });
                return;
            }
            if (typeof value === 'string') {
                params.set(name, value);
            } else if (typeof value === 'number') {
                params.set(name, value.toString());
            } else if (typeof value === 'boolean') {
                params.set(name, value ? 'true' : 'false');
            } else {
                DebugHelpers.log(DebugHelpers.WARN, 'Query value should be a string, number or boolean', { name, value });
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
                DebugHelpers.log(DebugHelpers.WARN, 'Array item should be a string or number', { item });
                return '';
            }
        }).join(separator);
    }
}