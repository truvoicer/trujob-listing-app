import { PayPalButtons } from "@paypal/react-paypal-js/dist/types/components/PayPalButtons";
import { PayPalScriptProvider } from "@paypal/react-paypal-js/dist/types/components/PayPalScriptProvider";

function PayPalDetails() {
  return (
        <PayPalScriptProvider options={{ clientId: "test" }}>
            <PayPalButtons style={{ layout: "horizontal" }} />
        </PayPalScriptProvider>
  );
}

export default PayPalDetails;