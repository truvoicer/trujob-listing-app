
import { useContext } from "react";
import { PaymentGateway } from "@/types/PaymentGateway";
import { CheckoutContext } from "./Checkout/context/CheckoutContext";
import { PaymentFactory } from "./Payment/PaymentFactory";
import { PaymentRequestType } from "./Payment/Service/PaymentService";
import { StepperComponentProps } from "@/components/Elements/Stepper";

export const PAYMENT_METHODS_FETCH_ERROR_NOTIFICATION_ID =
  "payment-methods-fetch-error-notification";
export const PAYMENT_METHODS_DELETE_ERROR_NOTIFICATION_ID =
  "payment-methods-delete-error-notification";

export type ConfirmationProps = {

};
function Confirmation({
  showNext,
  showPrevious,
}: ConfirmationProps & StepperComponentProps) {
  const checkoutContext = useContext(CheckoutContext);

  return (
    <div className="container">
      <div className="row">
      {
        PaymentFactory.make(
          checkoutContext?.transaction?.payment_gateway?.name
        )?.renderConfirmation()
      }
      </div>
    </div>
  );
}
export default Confirmation;
