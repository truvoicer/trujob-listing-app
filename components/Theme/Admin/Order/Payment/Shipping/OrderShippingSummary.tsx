import {
  CheckoutContext,
  CheckoutContextType,
} from "@/components/Theme/Admin/Order/Payment/Checkout/context/CheckoutContext";
import { OrderService } from "@/library/services/cashier/OrderService";
import { Order } from "@/types/Order";
import React, { useContext, useEffect } from "react";

export type OrderShippingSummaryProps = {
  editable?: boolean;
};
function OrderShippingSummary({ editable = false }: OrderShippingSummaryProps) {
  const checkoutContext = useContext(CheckoutContext) as CheckoutContextType;
  const orderService = new OrderService(checkoutContext.order);
  const order: Order | null = checkoutContext.order;

  useEffect(() => {
    checkoutContext.refresh(
      checkoutContext.order?.id,
      "availableShippingMethods"
    );
  }, [order]);

  console.log("Order Summary", order);
  return (
    <div className="row">
      <div className="col-sm-12">
        <h5 className="mb-3">Order Summary</h5>
        <div className="table-responsive-sm">
          <table className="table">
            <tbody>
              {Array.isArray(order?.items) &&
                order.items.map((item: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      {orderService
                        .getOrderItemService()
                        .getOrderItemFactory()
                        .make(item?.order_itemable_type)
                        .renderOrderShippingSummaryRow(item, index, {
                          editable: editable,
                        })}
                    </React.Fragment>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="text-right">
                  <strong>Total Discounts:</strong>
                </td>
                <td className="text-center">
                  {orderService.getTotalDiscountAmount(order)}
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="text-right">
                  <strong>Total Tax:</strong>
                </td>
                <td className="text-center">
                  {orderService.getTotalTaxAmount(order)}
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="text-right">
                  <strong>Total Amount:</strong>
                </td>
                <td className="text-center">
                  {orderService.getTotalAmount(order)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
export default OrderShippingSummary;
