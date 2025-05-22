import Checkout from "@/components/blocks/Payment/Checkout/Checkout";

export type ListingTestCheckoutProps = {
  listingId: number;
  modalId?: string;
}
function ListingTestCheckout({
  listingId,
  modalId,
}: ListingTestCheckoutProps) {
  return (
    <Checkout

    />
  );
}

export default ListingTestCheckout;