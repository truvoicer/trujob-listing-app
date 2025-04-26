export class RequestHelpers {
    static extractIdsFromArray(items: Array<any>): Array<number> {
        const filterItemData: Array<any> = items
            .filter((item: any | number) => {
                if (typeof item === 'object') {
                    return item.id;
                }
                return false;
            });
        return filterItemData.map((item: any) => {
            return item.id;
        });
    }
}