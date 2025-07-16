import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { PaymentGateway } from "@/types/PaymentGateway";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { useContext, useEffect, useState } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import Loader from "@/components/Loader";
import PayPalPaymentButtons from "./PayPalPaymentButtons";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { PaymentDetailsProps } from "../../Service/PaymentService";

function PayPalDetails({
  onSuccess,
  onError,
  onCancel,
}: PaymentDetailsProps) {
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(
    null
  );
  const checkoutContext = useContext(CheckoutContext);

  async function sitePaymentGatewayRequest(): Promise<void> {
    if (!checkoutContext?.transaction?.payment_gateway?.id) {
      console.error("Payment gateway ID is not available");
      return;
    }
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        TruJobApiMiddleware.getConfig().endpoints.sitePaymentGateway,
        checkoutContext?.transaction?.payment_gateway?.id,
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
      encrypted: true,
    });
    if (!response?.data) {
      console.error("Failed to fetch payment gateway details");
      return;
    }
    setPaymentGateway(response.data);
  }

  useEffect(() => {
    sitePaymentGatewayRequest();
  }, []);

  const userCurrency = LocaleService.getUserCurrency();

  console.log(
    "PayPalDetails component rendered with payment gateway:",
    paymentGateway,
    userCurrency
  );
  return (
    <>
      {paymentGateway && paymentGateway?.site?.settings?.client_id ? (
        <PayPalScriptProvider
          options={{
            clientId: paymentGateway.site.settings.client_id,
            currency: userCurrency?.code,
          }}
        >
          <PayPalPaymentButtons
            onSuccess={(type, data) => {
              console.log("PayPal payment successful:", type, data);
              if (typeof onSuccess === "function") {
                onSuccess(type, data);
              }
            }}
            onError={(type, error, data) => {
              console.error("PayPal payment error:", type, error, data);
              if (typeof onError === "function") {
                onError(type, error, data);
              }
            }}
            onCancel={(type, data) => {
              console.warn("PayPal payment cancelled:", type, data);
              if (typeof onCancel === "function") {
                onCancel(type, data);
              }
            }}
          />
        </PayPalScriptProvider>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default PayPalDetails;
