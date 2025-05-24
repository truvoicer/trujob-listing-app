export class LocaleHelpers {
    static getAddressesByType(addresses: any[], type: 'billing' | 'shipping'): any[] {
        if (!Array.isArray(addresses) || addresses.length === 0) {
            return [];
        }
        return addresses.filter(address => address?.type === type);
    }
    static getDefaultAddress(addresses: any[], type: 'billing' | 'shipping'): any | null {
        if (!Array.isArray(addresses) || addresses.length === 0) {
            return null;
        }
        const filteredAddresses = this.getAddressesByType(addresses, type);
        return filteredAddresses.find(address => address?.is_default) || null;
    }
}