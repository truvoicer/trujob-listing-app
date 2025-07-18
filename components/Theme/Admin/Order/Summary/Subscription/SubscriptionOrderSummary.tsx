import {
  CheckoutContext,
  CheckoutContextType,
} from "@/components/Theme/Admin/Order/Payment/Checkout/context/CheckoutContext";
import { OrderService } from "@/library/services/cashier/OrderService";
import { Order } from "@/types/Order";
import React, { useContext } from "react";

export type SubscriptionOrderSummaryProps = {
  editable?: boolean;
};
function SubscriptionOrderSummary({
  editable = false,
}: SubscriptionOrderSummaryProps) {
  const checkoutContext = useContext(CheckoutContext) as CheckoutContextType;
  const orderService = new OrderService(checkoutContext.order);
  const order: Order | null = checkoutContext.order;
  // console.log("Order Summary", order);
  return (
    <div className="row">
      <div className="col-sm-12">
        <h5 className="mb-3">Order Summary</h5>
        {Array.isArray(order?.items) &&
          order.items.map((item: any, index: number) => {
            return (
              <React.Fragment key={index}>
                {orderService
                  .getOrderItemService()
                  .getOrderItemFactory()
                  .make(item?.order_itemable_type)
                  ?.renderSubscriptionOrderSummaryRow(item, index, {
                    editable: editable,
                  })}
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
export default SubscriptionOrderSummary;
