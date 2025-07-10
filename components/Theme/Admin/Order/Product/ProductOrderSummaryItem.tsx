import { CheckoutContext } from "@/components/Theme/Admin/Order/Payment/Checkout/context/CheckoutContext";
import QuantityInput from "@/components/QuantityInput";
import { OrderItemService } from "@/library/services/cashier/order/item/OrderItemService";
import { OrderItem } from "@/types/Order";
import { Product } from "@/types/Product";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export type ProductOrderSummaryItem = {
  editable?: boolean;
  item: OrderItem;
  index: number;
};
function ProductOrderSummaryItem({ editable = false, item, index }: ProductOrderSummaryItem) {
  const [quantity, setQuantity] = useState(item.quantity);
  const product: Product = item.entity;

  const checkoutContext = useContext(CheckoutContext);

  const orderItemService = new OrderItemService();

  useEffect(() => {

  }, [quantity]);
  console.log
  return (
    <tr>
      <th className="text-center" scope="row">
        {index + 1}
      </th>
      <td>
        <h6 className="mb-0">{product.title}</h6>
        <p className="mb-0">{product.description}</p>
      </td>
      <td className="text-center">
        {editable ? (
          <QuantityInput
            value={quantity}
            min={1}
            max={10}
            onChange={(val) => setQuantity(val)}
          />
        ) : (
          <span>{item.quantity}</span>
        )}
      </td>
      <td className="text-center">{orderItemService.getPrice(item)}</td>
      <td className="text-center">{orderItemService.getTotal(item)}</td>
      {editable && (
        <td className="text-center">
          <Link className="text-danger" href="#" onClick={handleItemDelete}>
            <i className="ri-delete-bin-6-line mr-3"></i>
          </Link>
        </td>
      )}
    </tr>
  );
}
export default ProductOrderSummaryItem;
