import { useContext } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import { PaymentDetailsProps } from "../../Service/PaymentService";
import StripeOneTime from "./StripeOneTime";
import StripeSubscription from "./StripeSubscription";

function StripeDetails({
  onSuccess,
  onError,
  onCancel,
}: PaymentDetailsProps) {
  
  const checkoutContext = useContext(CheckoutContext);
  console.log("Checkout Context:", checkoutContext);
  function renderStripeDetail() {
    switch (checkoutContext?.order?.price_type) {
      case "subscription":
        return (
          <StripeSubscription
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
          />
        );
      case "one_time":
        return (
          <StripeOneTime
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

  return renderStripeDetail();

}

export default StripeDetails;
