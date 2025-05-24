import { useState } from "react";
import { CheckoutContext, CheckoutContextType, checkoutData } from "./context/CheckoutContext";

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
    function addOrderItem(data: Record<string, any>) {
        setCheckoutState((prevState: CheckoutContextType) => {
            let newState = { ...prevState };
            if (!newState.order || !newState.order.items) {
                newState.order = { ...newState.order, items: [] };
            }
            // Add the new order item to the order items array
            newState.order.items.push(data);
            return newState;
        });
    }
    function removeOrderItem(id: number) {
        setCheckoutState((prevState: CheckoutContextType) => {
            let newState = { ...prevState };
            if (!newState.order || !newState.order.items) {
                return newState;
            }
            const findOrderItemIndex = newState.order.items.findIndex(item => item.id === id);
            if (findOrderItemIndex === -1) {
                console.warn(`Order item with id ${id} not found.`);
                return newState;
            }
            // Remove the specific order item
            newState.order.items.splice(findOrderItemIndex, 1);
            return newState;
        });
    }
    function updateOrderItem(id: number, data: Record<string, any>) {
        setCheckoutState((prevState: CheckoutContextType) => {
            let newState = { ...prevState };
            if (!newState.order || !newState.order.items) {
                return newState;
            }
            const findOrderItemIndex = newState.order.items.findIndex(item => item.id === id);
            if (findOrderItemIndex === -1) {
                console.warn(`Order item with id ${id} not found.`);
                return newState;
            }
            // Update the specific order item with the provided data   
            newState.order.items[findOrderItemIndex] = {
                ...newState.order.items[findOrderItemIndex],
                ...data
            };
            return newState;
        });
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