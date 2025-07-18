import { CheckoutContext, CheckoutContextType } from "@/components/Theme/Admin/Order/Payment/Checkout/context/CheckoutContext";
import { OrderService } from "@/library/services/cashier/OrderService";
import { Order } from "@/types/Order";
import React, { useContext } from "react";
import OneTimeOrderSummary from "./OneTime/OneTimeOrderSummary";
import SubscriptionOrderSummary from "./Subscription/SubscriptionOrderSummary";

export type OrderSummaryProps = {
    editable?: boolean;
};
function OrderSummary({
    editable = false,
}: OrderSummaryProps) {
    const checkoutContext = useContext(CheckoutContext) as CheckoutContextType;
    const orderService = new OrderService(checkoutContext.order);
    const order: Order | null = checkoutContext.order;
    
    function renderOrderSummary() {
        switch (order?.price_type) {
            case "one_time":
                return <OneTimeOrderSummary editable={editable} />;
            case "subscription":
                return <SubscriptionOrderSummary editable={editable} />;
            default:
                return null;
        }
    }
    return renderOrderSummary();
}
export default OrderSummary;