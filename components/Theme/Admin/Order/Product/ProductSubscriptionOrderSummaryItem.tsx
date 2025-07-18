import { CheckoutContext } from "@/components/Theme/Admin/Order/Payment/Checkout/context/CheckoutContext";
import QuantityInput from "@/components/QuantityInput";
import { OrderItemService } from "@/library/services/cashier/order/item/OrderItemService";
import { OrderItem } from "@/types/Order";
import { Product } from "@/types/Product";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export type ProductSubscriptionOrderSummaryItem = {
  editable?: boolean;
  item: OrderItem;
  index: number;
};
function ProductSubscriptionOrderSummaryItem({
  editable = false,
  item,
  index,
}: ProductSubscriptionOrderSummaryItem) {
  const [quantity, setQuantity] = useState(item.quantity);
  const product: Product = item.entity;

  const checkoutContext = useContext(CheckoutContext);

  const orderItemService = new OrderItemService();

  console.log("ProductSubscriptionOrderSummaryItem", item);
  return (
    <>
      {/* <div className="row">
        <div className="col-sm-12">
          <img
            src="../assets/images/logo.png"
            className="logo-invoice img-fluid mb-3"
          />
          <h5 className="mb-0">Hello, Barry Techs</h5>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>
        </div>
      </div> */}
      <div className="row">
        <div className="col-lg-12">
          <div className="table-responsive-sm">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{item?.entity?.title || "Product title error"}</td>
                  <td>
                    {item?.entity?.description || "Product description error"}
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="row">
        {Array.isArray(item?.entity?.prices) &&
          item?.entity?.prices.map((price, priceIndex) => (
            <div className="col-sm-12" key={priceIndex}>
              <h5 className="mb-3">Plan</h5>
              <div className="table-responsive-sm">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-left" scope="col">
                        Frequency
                      </th>
                      <th scope="col">Item</th>
                      <th className="text-left" scope="col">
                        Cycles
                      </th>
                      <th className="text-left" scope="col">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(price?.items) &&
                      price?.items.map((plan, planIndex) => (
                        <tr key={planIndex}>
                          <td className="text-left" scope="row">
                            {`${
                              plan.frequency.interval_count
                            } ${plan.frequency.interval_unit.toLowerCase()}`}
                          </td>
                          <td>
                            <h6 className="mb-0">
                              {plan?.tenure_type || ''}
                            </h6>
                          </td>
                          <td className="text-left">
                            <b>{plan?.total_cycles || 0}</b>
                          </td>
                          <td className="text-left">
                            <b>${plan?.price?.value || 0}</b>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
export default ProductSubscriptionOrderSummaryItem;
