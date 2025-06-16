import { useState } from "react";
import { ShippingProviderContext } from "./context/ShippingProviderContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ShippingProviderContextDataType, ShippingService } from "@/library/services/cashier/shipping/ShippingService";

export type ShippingProviderProps = {
    children: React.ReactNode;
};
function ShippingProvider({ children }: ShippingProviderProps) {
    function updateShippingProviderState(data: ShippingProviderContextDataType) {
        setShippingProviderContextState((prevState: ShippingProviderContextDataType) => {
            const cloneState: ShippingProviderContextDataType = { ...prevState };
            Object.keys(data).forEach((key) => {
                if (ShippingService.CONTEXT_DATA.hasOwnProperty(key)) {
                    cloneState[key] = data[key];
                }
            });
            return cloneState;
        });
    }

    async function fetchShippingWeightUnits() {
        // Fetch shippingWeightUnits from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shipping}/weight-unit`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping rate types');
            return;
        }
        updateShippingProviderState({
            weightUnits: response?.data || [],
        });
    }
    async function fetchShippingUnits() {
        // Fetch shippingUnits from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shipping}/unit`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping rate types');
            return;
        }
        updateShippingProviderState({
            units: response?.data || [],
        });
    }
    async function fetchShippingRateTypes() {
        // Fetch shippingRateTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shippingRate}/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping rate types');
            return;
        }
        updateShippingProviderState({
            rateTypes: response?.data || [],
        });
    }

    async function fetchShippingRestrictionActions() {
        // Fetch shippingRestrictionActions from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shipping}/restriction/action`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping restriction actions');
            return;
        }
        updateShippingProviderState({
            restrictionActions: response?.data || [],
        });
    }

    function refreshShippingProviderState(entity: string) {
        switch (entity) {
            case ShippingService.REFRESH.TYPE.RATE_TYPES:
                fetchShippingRateTypes();
                break;
            case ShippingService.REFRESH.TYPE.RESTRICTION_ACTIONS:
                fetchShippingRestrictionActions();
                break;
            case ShippingService.REFRESH.TYPE.UNITS:
                fetchShippingUnits();
                break;
            case ShippingService.REFRESH.TYPE.WEIGHT_UNITS:
                fetchShippingWeightUnits();
                break;
            default:
                console.warn(`Unknown entity: ${entity}`);
                return; 
            }
    }
    const [shippingProviderContextState, setShippingProviderContextState] = useState({
        ...ShippingService.CONTEXT_DATA,
        update: updateShippingProviderState,
        refresh: refreshShippingProviderState,
    });

    return (
        <ShippingProviderContext.Provider value={shippingProviderContextState}>
            {children}
        </ShippingProviderContext.Provider>
    );
}
export default ShippingProvider;