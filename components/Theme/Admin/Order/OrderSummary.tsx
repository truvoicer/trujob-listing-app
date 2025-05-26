import { CheckoutContext, CheckoutContextType } from "@/components/blocks/Payment/Checkout/context/CheckoutContext";
import { OrderService } from "@/library/services/cashier/OrderService";
import { Order } from "@/types/Cashier";
import React, { useContext } from "react";

export type OrderSummaryProps = {
    editable?: boolean;
};
function OrderSummary({
    editable = false,
}: OrderSummaryProps) {
    const checkoutContext = useContext(CheckoutContext) as CheckoutContextType;
    const orderService = new OrderService(checkoutContext.order);
    const order: Order | null = checkoutContext.order;
    return (
        <div className="row">
            <div className="col-sm-12">
                <h5 className="mb-3">Order Summary</h5>
                <div className="table-responsive-sm">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-center" scope="col">#</th>
                                <th scope="col">Item</th>
                                <th className="text-center" scope="col">Quantity</th>
                                <th className="text-center" scope="col">Price</th>
                                <th className="text-center" scope="col">Totals</th>
                                {editable && <th className="text-center" scope="col">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(order?.items) && order.items.map((item: any, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        {
                                            orderService.getOrderItemFactory().build(
                                                item,
                                                index,
                                                {
                                                    editable: editable
                                                }
                                            )
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default OrderSummary;