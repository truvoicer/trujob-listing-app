
export type ShippingProviderContextDataType = {
    [key: string]: string[] | ((data: ShippingProviderContextDataType) => void) | undefined | ((entity: string) => void);
    rateTypes?: string[];
    restrictionActions?: string[];
    units?: string[];
    weightUnits?: string[];
};
export interface ShippingProviderContextType extends ShippingProviderContextDataType {
    refresh: (entity: string) => void;
    update: (data: ShippingProviderContextDataType) => void;
};

export class ShippingService {
    static REFRESH = {
        TYPE: {
            RATE_TYPES: 'rateTypes',
            RESTRICTION_ACTIONS: 'restrictionActions',
            UNITS: 'units',
            WEIGHT_UNITS: 'weightUnits',
        }
    };

    static CONTEXT_DATA: ShippingProviderContextType = {
        rateTypes: [],
        restrictionActions: [],
        units: [],
        weightUnits: [],
        refresh: () => { return; },
        update: () => { return; }
    };
    
}