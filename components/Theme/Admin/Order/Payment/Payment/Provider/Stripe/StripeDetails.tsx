import { useContext } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import StripeCheckout from "./StripeCheckout";

import { StripePaymentDetailsProps } from "../../Service/StripeService";

function StripeDetails({
  showNext,
  showPrevious,
  goToNext,
}: StripePaymentDetailsProps) {
  const checkoutContext = useContext(CheckoutContext);

  console.log("Checkout Context:", checkoutContext);

  function renderStripeDetail() {
    switch (checkoutContext?.order?.price_type) {
      case "subscription":
        return (
          <StripeCheckout
            checkoutType="subscription"
            showNext={showNext}
            showPrevious={showPrevious}
            goToNext={goToNext}
          />
        );
      case "one_time":
        return (
          <StripeCheckout
            checkoutType="one_time"
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

  return renderStripeDetail();
}

export default StripeDetails;
