import StripeConfirmation from "../Provider/Stripe/StripeConfirmation";
import StripeDetails from "../Provider/Stripe/StripeDetails";
import { PaymentServiceInterface } from "./PaymentService";

export const STRIPE_PAYMENT_REQUEST_TYPE = {
  PAYMENT: "payment",
  CHECKOUT_SESSION: "checkout-session",
} as const;

export type StripePaymentRequestType = "payment" | "checkout-session";
export type StripePaymentDetailsProps = {
  checkoutType: "subscription" | "one_time";
  showNext?: () => void;
  showPrevious?: () => void;
  goToNext?: () => void;
};
export class StripeService implements PaymentServiceInterface {
  public showDetails(props: StripePaymentDetailsProps): null | React.ReactNode {
    return <StripeDetails {...props} />;
  }

  public renderConfirmation(): null | React.ReactNode {
    return <StripeConfirmation />;
  }
}
