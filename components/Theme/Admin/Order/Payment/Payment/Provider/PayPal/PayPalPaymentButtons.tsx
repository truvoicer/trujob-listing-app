import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useContext } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import Loader from "@/components/Loader";
import { PayPalPaymentDetailsProps } from "../../Service/PayPalService";

export type PayPalPaymentButtonsProps = PayPalPaymentDetailsProps & {
  createOrder?: () => Promise<string>;
  createSubscription?: () => Promise<string>;
  onApprove?: (data: Record<string, unknown>) => void;
};
function PayPalPaymentButtons({
  createOrder,
  createSubscription,
  onApprove,
}: PayPalPaymentDetailsProps & PayPalPaymentButtonsProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const checkoutContext = useContext(CheckoutContext);
  function buildProps() {
   const props: Record<string, unknown> = {};
   if (typeof createOrder === "function") {
     props.createOrder = createOrder;
   }
   if (typeof createSubscription === "function") {
     props.createSubscription = createSubscription;
   }
   if (typeof onApprove === "function") {
     props.onApprove = onApprove;
   }
   return props;
  }

  return (
    <>
      {isPending ? <Loader /> : null}
      <PayPalButtons
        style={{ layout: "horizontal" }}
        disabled={false}
        {...buildProps()}
      />
    </>
  );
}

export default PayPalPaymentButtons;
