import Checkout from "@/components/blocks/Payment/Checkout/Checkout";
import { useEffect } from "react";

export type ListingTestCheckoutProps = {
  listingId: number;
  modalId?: string;
}
function ListingTestCheckout({
  listingId,
  modalId,
}: ListingTestCheckoutProps) {

  useEffect(() => {

  }, [listingId]);
  return (
    <Checkout

    />
  );
}

export default ListingTestCheckout;