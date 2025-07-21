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

//     {
//     "_sdkVersion": "v1",
//     "billingAddress": null,
//     "businessName": "Truvoice sandbox",
//     "canConfirm": false,
//     "currency": "gbp",
//     "discountAmounts": [],
//     "email": "test@user.com",
//     "id": "cs_test_a1e9VO7Xl4ScovdCwgfVPxyFHv87syZdUqF08VfZra43kHag50uqEbuM3R",
//     "lastPaymentError": null,
//     "lineItems": [
//         {
//             "id": "li_1RmuCCBTFXsqW11eIXtFSH8T",
//             "name": "Voluptatem minus.",
//             "total": {
//                 "amount": "£178.17",
//                 "minorUnitsAmount": 17817
//             },
//             "discount": {
//                 "amount": "£0.00",
//                 "minorUnitsAmount": 0
//             },
//             "subtotal": {
//                 "amount": "£178.17",
//                 "minorUnitsAmount": 17817
//             },
//             "taxExclusive": {
//                 "amount": "£0.00",
//                 "minorUnitsAmount": 0
//             },
//             "taxInclusive": {
//                 "amount": "£0.00",
//                 "minorUnitsAmount": 0
//             },
//             "unitAmount": {
//                 "amount": "£178.17",
//                 "minorUnitsAmount": 17817
//             },
//             "description": "Libero fuga id atque perferendis quae quaerat deleniti. Autem ratione totam rerum minus.",
//             "quantity": 1,
//             "discountAmounts": [],
//             "taxAmounts": [],
//             "recurring": null,
//             "adjustableQuantity": null,
//             "images": []
//         }
//     ],
//     "livemode": false,
//     "phoneNumber": null,
//     "minorUnitsAmountDivisor": 100,
//     "recurring": null,
//     "savedPaymentMethods": null,
//     "shipping": null,
//     "shippingAddress": null,
//     "shippingOptions": [],
//     "status": {
//         "type": "complete",
//         "paymentStatus": "paid"
//     },
//     "tax": {
//         "status": "ready"
//     },
//     "taxAmounts": [],
//     "taxIdInfo": null,
//     "total": {
//         "subtotal": {
//             "amount": "£178.17",
//             "minorUnitsAmount": 17817
//         },
//         "taxExclusive": {
//             "amount": "£0.00",
//             "minorUnitsAmount": 0
//         },
//         "taxInclusive": {
//             "amount": "£0.00",
//             "minorUnitsAmount": 0
//         },
//         "shippingRate": {
//             "amount": "£0.00",
//             "minorUnitsAmount": 0
//         },
//         "discount": {
//             "amount": "£0.00",
//             "minorUnitsAmount": 0
//         },
//         "total": {
//             "amount": "£178.17",
//             "minorUnitsAmount": 17817
//         },
//         "appliedBalance": {
//             "amount": "£0.00",
//             "minorUnitsAmount": 0
//         },
//         "balanceAppliedToNextInvoice": false
//     }
// }
export type StripeCheckoutFormProps = {
  session: SessionState; // Define the type of session if available
} & PaymentProps;
function StripeCheckoutForm({
  session,
  onSuccess,
  onError,
  onCancel,
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
