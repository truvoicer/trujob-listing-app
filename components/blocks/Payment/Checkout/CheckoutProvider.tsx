import { useState } from "react";
import { CheckoutContext, CheckoutContextType, checkoutData } from "./context/CheckoutContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";

export type CheckoutProviderProps = {
    children: React.ReactNode;
}
function CheckoutProvider({
    children
}: CheckoutProviderProps) {

    const [checkoutState, setCheckoutState] = useState<CheckoutContextType>({
        ...checkoutData,
        update: updateCheckoutData,
        updateOrderItem: updateOrderItem,
        removeOrderItem: removeOrderItem,
        addOrderItem: addOrderItem,
        refresh: refreshEntity,
    });
    function refreshEntity(entity: 'order' | 'transaction' | 'paymentMethod') {
        switch (entity) {
            case 'order':

                break;
            case 'transaction':
                // Logic to refresh transaction
                break;
            case 'paymentMethod':
                // Logic to refresh payment method
                break;
            default:
                console.warn(`Unknown entity type: ${entity}`);
                break;
        }
    }
    async function addOrderItem(data: Record<string, any>) {
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: truJobApiConfig.endpoints.orderItem,
            method: TruJobApiMiddleware.METHOD.POST,
            protectedReq: true,
            data: data,
        });
        if (!response || !response.data) {
            console.error("Failed to add order item. No response or data received.");
            return;
        }
        refreshEntity('order');
    }
    function removeOrderItem(id: number) {
        const response = TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.orderItem}/${id}`,
            method: TruJobApiMiddleware.METHOD.DELETE,
            protectedReq: true,
        });
        if (!response) {
            console.error(`Failed to remove order item with id ${id}. No response received.`);
            return;
        }
        refreshEntity('order');
    }
    function updateOrderItem(id: number, data: Record<string, any>) {
        const response = TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.orderItem}/${id}`,
            method: TruJobApiMiddleware.METHOD.PUT,
            protectedReq: true,
            data: data,
        });
        if (!response || !response.data) {
            console.error(`Failed to update order item with id ${id}. No response or data received.`);
            return;
        }
        refreshEntity('order');
    }
    function updateCheckoutData(data: CheckoutContextType) {
        setCheckoutState((prevState: CheckoutContextType) => {
            let newState = { ...prevState };
            Object.keys(data).forEach((key) => {
                if (key in newState) {
                    newState[key] = data[key];
                }
            });
            return newState;
        });
    }

    return (
        <CheckoutContext.Provider value={checkoutState}>
            <div className="checkout-provider">
                {children}
            </div>
        </CheckoutContext.Provider>
    );
}

export default CheckoutProvider;