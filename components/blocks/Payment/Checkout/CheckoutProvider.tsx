import { useContext, useEffect, useState } from "react";
import { CheckoutContext, CheckoutContextType, checkoutData } from "./context/CheckoutContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { Order } from "@/types/Cashier";
import { PaymentGateway } from "@/types/PaymentGateway";
import { Price } from "@/types/Price";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";

export type CheckoutProviderProps = {
    children: React.ReactNode;
    fetchOrder: () => Promise<Order | null>;
    fetchPaymentMethod: () => Promise<PaymentGateway | null>;
    fetchPrice: () => Promise<Price | null>;
}
function CheckoutProvider({
    children,
    fetchOrder,
    fetchPaymentMethod,
    fetchPrice,
}: CheckoutProviderProps) {

    const [checkoutState, setCheckoutState] = useState<CheckoutContextType>({
        ...checkoutData,
        update: updateCheckoutData,
        updateOrderItem: updateOrderItem,
        removeOrderItem: removeOrderItem,
        addOrderItem: addOrderItem,
        refresh: refreshEntity,
    });

    const notificationContext = useContext(AppNotificationContext);

    async function handleFetchOrder() {
        if (typeof fetchOrder !== 'function') {
            console.error("fetchOrder is not a function");
            return;
        }
        const response = await fetchOrder();
        
        if (!response) {
            return false;
        }
        updateCheckoutData({
            order: response,
        });
    }

    async function handleFetchPaymentMethod() {
        if (typeof fetchPaymentMethod !== 'function') {
            console.error("fetchPaymentMethod is not a function");
            return;
        }
        const response = await fetchPaymentMethod();
        if (!response) {
            return false;
        }
        updateCheckoutData({
            paymentMethod: response,
        });
    }
    async function fetchTransaction() {

    }
    async function handleFetchPrice() {
        if (typeof fetchPrice !== 'function') {
            console.error("fetchPrice is not a function");
            return;
        }
        const response = await fetchPrice();
        if (!response) {
            return false;
        }
        updateCheckoutData({
            price: response,
        });
    }

    async function refreshEntity(entity: 'order' | 'transaction' | 'paymentMethod' | 'price') {
        switch (entity) {
            case 'order':
                await handleFetchOrder();
                break;
            case 'transaction':
                await fetchTransaction();
                break;
            case 'paymentMethod':
                await handleFetchPaymentMethod();
                break;
            case 'price':
                handleFetchPrice();
                break;
            default:
                console.warn(`Unknown entity type: ${entity}`);
                break;
        }
    }
    async function addOrderItem(data: Record<string, any>, checkoutContext: CheckoutContextType) {
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.orderItem.replace(':orderId', String(checkoutContext.order?.id)),
                'store'
            ]),
            method: TruJobApiMiddleware.METHOD.POST,
            protectedReq: true,
            data: data,
        });
        if (!response || !response.data) {
            console.error("Failed to add order item. No response or data received.");
            return;
        }
        checkoutContext.refresh('order');
        refreshEntity('order');
    }
    function removeOrderItem(id: number, checkoutContext: CheckoutContextType) {
        const response = TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.orderItem.replace(':orderId', String(checkoutContext.order?.id)),
                id,
                'delete'
            ]),
            method: TruJobApiMiddleware.METHOD.DELETE,
            protectedReq: true,
        });
        if (!response) {
            console.error(`Failed to remove order item with id ${id}. No response received.`);
            return;
        }

        checkoutContext.refresh('order');
        refreshEntity('order');
    }
    function updateOrderItem(id: number, data: Record<string, any>, checkoutContext: CheckoutContextType) {
        const response = TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.orderItem.replace(':orderId', String(checkoutContext.order?.id)),
                id,
                'update'
            ]),
            method: TruJobApiMiddleware.METHOD.PATCH,
            protectedReq: true,
            data: data,
        });
        if (!response) {
            console.error(`Failed to update order item with id ${id}. No response or data received.`);
            return;
        }
        checkoutContext.refresh('order');
        refreshEntity('order');
    }
    function updateCheckoutData(data: CheckoutContextType) {
        setCheckoutState((prevState: CheckoutContextType) => {
            let newState = { ...prevState };
            Object.keys(data).forEach((key) => {
                newState[key] = data[key];

            });
            return newState;
        });
    }

    useEffect(() => {
        handleFetchOrder();
        handleFetchPaymentMethod();
        handleFetchPrice();
    }, []);

    return (
        <CheckoutContext.Provider value={checkoutState}>
            <div className="checkout-provider">
                {children}
            </div>
        </CheckoutContext.Provider>
    );
}

export default CheckoutProvider;