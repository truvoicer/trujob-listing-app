import { useContext } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import { PaymentDetailsProps } from "../../Service/PaymentService";
import PayPalSubscription from "./PayPalSubscription";
import PayPalOneTime from "./PayPalOneTime";

function PayPalDetails({ onSuccess, onError, onCancel }: PaymentDetailsProps) {
  const checkoutContext = useContext(CheckoutContext);

  function renderPaypalDetail() {
    switch (checkoutContext?.order?.price_type) {
      case "subscription":
        return (
          <PayPalSubscription
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
          />
        );
      case "one_time":
        return (
          <PayPalOneTime
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
          />
        );
      default:
        console.error(
          "Unsupported price type:",
          checkoutContext?.order?.price_type
        );
        return null;
    }
  }

  return renderPaypalDetail();
}

export default PayPalDetails;
