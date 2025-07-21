import { Stripe } from "@stripe/stripe-js";
import { PaymentProps } from "../../Service/PaymentService";
import { StripeOneTimeFormProps } from "./StripeCheckoutForm";
import { StripePaymentRequestType } from "../../Service/StripeService";

function StripeSubscription({
  showNext,
  showPrevious,
  goToNext,
}: StripeOneTimeFormProps) {
  function onSuccess(
    paymentRequestType: StripePaymentRequestType,
    data: Record<string, unknown>
  ) {
    switch (paymentRequestType) {
      case "checkout-session":
        console.log(
          "Stripe checkout session successful:",
          paymentRequestType,
          data
        );
        if (typeof goToNext === "function") {
          goToNext();
        }
        break;
      case "payment":
        console.log("Stripe payment successful:", paymentRequestType, data);
        if (typeof goToNext === "function") {
          goToNext();
        }
        break;
      default:
        console.error(
          "Stripe success: Unknown payment request type:",
          paymentRequestType
        );
    }
  }

  function onError(
    paymentRequestType: StripePaymentRequestType,
    error: Error,
    data?: Record<string, unknown> | null
  ) {
    switch (paymentRequestType) {
      case "checkout-session":
        console.log("Stripe checkout session error:", paymentRequestType, data);
        break;
      case "payment":
        console.log("Stripe payment error:", paymentRequestType, data);
        break;
      default:
        console.error(
          "Stripe error: Unknown payment request type:",
          paymentRequestType
        );
    }
  }
  function onCancel(
    paymentRequestType: StripePaymentRequestType,
    data: Record<string, unknown>
  ) {
    switch (paymentRequestType) {
      case "checkout-session":
        console.log(
          "Stripe checkout session cancelled:",
          paymentRequestType,
          data
        );
        break;
      case "payment":
        console.log("Stripe payment cancelled:", paymentRequestType, data);
        break;
      default:
        console.error(
          "Stripe cancel: Unknown payment request type:",
          paymentRequestType
        );
    }
  }

  return (
    <div>
      {/* Stripe payment details implementation goes here */}
      <h2>Stripe subscription Details</h2>
      {/* Add your Stripe payment components here */}
    </div>
  );
}

export default StripeSubscription;
