
import { useContext, useEffect } from "react";
import { PaymentGateway } from "@/types/PaymentGateway";
import { CheckoutContext } from "./Checkout/context/CheckoutContext";
import { PaymentFactory } from "./Payment/PaymentFactory";

export const PAYMENT_METHODS_FETCH_ERROR_NOTIFICATION_ID =
  "payment-methods-fetch-error-notification";
export const PAYMENT_METHODS_DELETE_ERROR_NOTIFICATION_ID =
  "payment-methods-delete-error-notification";

export type PaymentDetailProps = {
  onSelect?: (paymentMethod: PaymentGateway) => void;
  title?: string;
};
function PaymentDetail({
  title = "Payment Gateways",
}: PaymentDetailProps) {
  const checkoutContext = useContext(CheckoutContext);


  console.log("Shipping component rendered with order:", checkoutContext);
  return (
    <div className="container">
      <div className="row">
      {
        PaymentFactory.make(checkoutContext?.selectedPaymentGateway?.name)?.showDetails()
      }
      </div>
    </div>
  );
}
export default PaymentDetail;
