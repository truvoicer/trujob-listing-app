import { useContext, useState } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import {
  SESSION_STATE,
  SESSION_USER,
  SESSION_USER_EMAIL,
} from "@/library/redux/constants/session-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { Alert, Button } from "react-bootstrap";
import {
  ConfirmError,
  StripeCheckoutConfirmResult,
  StripeCheckoutSession,
} from "@stripe/stripe-js";
import {
  STRIPE_PAYMENT_REQUEST_TYPE,
} from "../../Service/StripeService";
import { connect } from "react-redux";
import { RootState } from "@/library/redux/store";
import { PaymentProps } from "../../Service/PaymentService";

export type StripeCheckoutFormProps = {
  session: SessionState; // Define the type of session if available
} & PaymentProps & {
  goToNext?: () => void;
};
function StripeCheckoutForm({
  session,
  onSuccess,
  goToNext,
}: StripeCheckoutFormProps) {
  const checkoutContext = useContext(CheckoutContext);
  const checkout = useCheckout();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleCheckoutError(error: ConfirmError) {
    console.error("Checkout error:", error);
    setMessage(error.message);
    setIsLoading(false);
  }

  function handleCheckoutSuccess(session: StripeCheckoutSession) {
    console.log("Checkout success:", session);
    switch (session.status.type) {
      case "complete":
        if (typeof onSuccess === "function") {
          onSuccess(STRIPE_PAYMENT_REQUEST_TYPE.PAYMENT, session);
        }
        setIsLoading(false);
        break;
      default:
        break;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    if (!session?.[SESSION_USER]?.[SESSION_USER_EMAIL]) {
      setMessage("Email is required");
      setIsLoading(false);
      return;
    }

    const confirmResult: StripeCheckoutConfirmResult = await checkout.confirm({
      email: session[SESSION_USER][SESSION_USER_EMAIL],
      redirect: "if_required",
    });
    switch (confirmResult.type) {
      case "success":
        handleCheckoutSuccess(confirmResult.session);
        break;
      case "error":
        handleCheckoutError(confirmResult.error);
        break;
      default:
        console.error("Unexpected confirmation result:", confirmResult);
        break;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {message && (
          <Alert variant="danger">
            <strong>Error:</strong> {message}
          </Alert>
        )}
        <PaymentElement />
        <div className="d-block d-md-flex justify-content-between mt-3">
          <Button
            variant="primary"
            onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              if (typeof goToNext === "function") {
                goToNext();
              }
            }}
          >
            {"Previous Step"}
          </Button>
          <Button type="submit" variant="success" disabled={isLoading}>
            {isLoading ? "Processing..." : "Complete Payment"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default connect(
  (state: RootState) => ({
    session: state[SESSION_STATE],
  }),
  null
)(StripeCheckoutForm);
