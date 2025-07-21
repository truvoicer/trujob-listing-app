import { useContext } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import PayPalSubscription from "./PayPalSubscription";
import PayPalOneTime from "./PayPalOneTime";
import { PayPalPaymentDetailsProps } from "../../Service/PayPalService";

function PayPalDetails({ showNext, showPrevious, goToNext }: PayPalPaymentDetailsProps) {
  const checkoutContext = useContext(CheckoutContext);

  function renderPaypalDetail() {
    switch (checkoutContext?.order?.price_type) {
      case "subscription":
        return (
          <PayPalSubscription
            showNext={showNext}
            showPrevious={showPrevious}
            goToNext={goToNext}
          />
        );
      case "one_time":
        return (
          <PayPalOneTime
            showNext={showNext}
            showPrevious={showPrevious}
            goToNext={goToNext}
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
