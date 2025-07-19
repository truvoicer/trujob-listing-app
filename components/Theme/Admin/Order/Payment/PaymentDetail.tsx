
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
        console.log("Paypal capture successful:", paymentRequestType, data);
        if (typeof goToNext === "function") {
          goToNext();
        }
        break;  
      case 'approve':
        console.log("Paypal approval successful:", paymentRequestType, data);
        if (typeof goToNext === "function") {
          goToNext();
        }
        break;
      case 'order':
        console.log("Paypal order successfully:", paymentRequestType, data);
        break;
      case 'cancel':
        console.warn("Paypal cancellation success:", paymentRequestType, data);
        break;
      default:
        console.error("Paypal success: Unknown payment request type:", paymentRequestType);
    }
  }

  function onError(
    paymentRequestType: PaymentRequestType,
    error: Error,
    data?: Record<string, unknown> | null
  ) {

    switch (paymentRequestType) {
      case 'capture':
        console.log("Paypal capture error:", paymentRequestType, data);
        break;  
      case 'approve':
        console.log("Paypal approval error:", paymentRequestType, data);
        break;
      case 'order':
        console.log("Paypal order error:", paymentRequestType, data);
        break;
      case 'cancel':
        console.warn("Paypal error:", paymentRequestType, data);
        break;
      default:
        console.error("Paypal error: Unknown payment request type:", paymentRequestType);
    }
  }
  function onCancel(
    paymentRequestType: PaymentRequestType,
    data: Record<string, unknown>
  ) {
    
    switch (paymentRequestType) {
      case 'capture':
        console.log("Paypal capture cancelled:", paymentRequestType, data);
        break;  
      case 'approve':
        console.log("Paypal approval cancelled:", paymentRequestType, data);
        break;
      case 'order':
        console.log("Paypal order cancelled:", paymentRequestType, data);
        break;
      case 'cancel':
        console.warn("Paypal cancellation:", paymentRequestType, data);
        break;
      default:
        console.error("Paypal cancel: Unknown payment request type:", paymentRequestType);
    }
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
