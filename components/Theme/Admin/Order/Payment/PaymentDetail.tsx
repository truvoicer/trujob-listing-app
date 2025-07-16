
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

export type PaymentDetailProps = {
  onSelect?: (paymentMethod: PaymentGateway) => void;
  title?: string;
};
function PaymentDetail({
  title = "Payment Gateways",
  showNext,
  showPrevious,
  goToNext
}: PaymentDetailProps & StepperComponentProps) {
  const checkoutContext = useContext(CheckoutContext);

  function onSuccess(
    paymentRequestType: PaymentRequestType, 
    data: Record<string, unknown>
  ) {
    switch (paymentRequestType) {
      case 'capture':
        console.log("Payment successful:", paymentRequestType, data);
        if (typeof goToNext === "function") {
          goToNext();
        }
        break;  
    }
  }

  function onError(
    paymentRequestType: PaymentRequestType,
    error: Error,
    data?: Record<string, unknown> | null
  ) {
    console.error("Payment error:", paymentRequestType, error, data);
  }
  function onCancel(
    paymentRequestType: PaymentRequestType,
    data: Record<string, unknown>
  ) {
    console.warn("Payment cancelled:", paymentRequestType, data);
  }
  return (
    <div className="container">
      <div className="row">
      {
        PaymentFactory.make(
          checkoutContext?.transaction?.payment_gateway?.name
        )?.showDetails({
          onSuccess: onSuccess,
          onError: onError,
          onCancel: onCancel,
        })
      }
      </div>
    </div>
  );
}
export default PaymentDetail;
