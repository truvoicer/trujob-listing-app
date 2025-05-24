import { CheckoutContext } from "@/components/blocks/Payment/Checkout/context/CheckoutContext";
import QuantityInput from "@/components/QuantityInput";
import { OrderItem } from "@/types/Cashier";
import { Listing } from "@/types/Listing";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export type ListingOrderItem = {
    editable?: boolean;
    item: OrderItem;
    index: number;
}
function ListingOrderItem({
    editable = false,
    item,
    index,

}: ListingOrderItem) {
    const [quantity, setQuantity] = useState(item.quantity);
    const listing: Listing = item.entity;

    const checkoutContext = useContext(CheckoutContext);

    useEffect(() => {
        checkoutContext.updateOrderItem(item.id, {
            quantity: quantity,
        });
    }, [quantity]);
    
    return (
        <tr>
            <th className="text-center" scope="row">{index + 1}</th>
            <td>
                <h6 className="mb-0">{listing.title}</h6>
                <p className="mb-0">{listing.description}</p>
            </td>
            <td className="text-center">
                <QuantityInput
                    value={quantity}
                    min={1}
                    max={10}
                    onChange={(val) => setQuantity(val)}
                />
            </td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            {editable && (
                <td className="text-center">
                    <Link className="text-danger" href="#" onClick={(e) => {
                        e.preventDefault();
                        console.warn("Delete action not implemented for ListingOrderItem");
                    }
                    }>
                        <i className="ri-delete-bin-6-line mr-3"></i>
                    </Link>
                </td>
            )}
        </tr>
    );
}
export default ListingOrderItem;