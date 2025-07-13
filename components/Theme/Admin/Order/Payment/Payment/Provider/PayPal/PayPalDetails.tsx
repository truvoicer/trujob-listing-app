import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { PaymentGateway } from "@/types/PaymentGateway";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

import { useContext, useEffect, useState } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import Loader from "@/components/Loader";

export type PayPalDetailsProps = {};
function PayPalDetails({}: PayPalDetailsProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(
    null
  );
  const checkoutContext = useContext(CheckoutContext);

  async function createOrder() {
    //  try {
      // Make an API call to your Laravel backend to create a PayPal order.
      // Your backend will interact with the PayPal API and return the orderID.
      // --- Mock API Call ---
      console.log("Calling backend to create PayPal order...");
      // In your real app, use TruJobApiMiddleware:
      // const orderCreationResponse = await TruJobApiMiddleware.getInstance().resourceRequest({
      //   endpoint: UrlHelpers.urlFromArray([
      //     TruJobApiMiddleware.getConfig().endpoints.createPayPalOrder, // e.g., '/api/paypal/create-order'
      //   ]),
      //   method: TruJobApiMiddleware.METHOD.POST,
      //   protectedReq: true,
      //   encrypted: true,
      //   data: {
      //     transactionId: checkoutContext.transaction.id,
      //     amount: checkoutContext.transaction.amount,
      //     currency: checkoutContext.transaction.currency,
      //   },
      // });

      // Mock response from your backend after it calls PayPal API
    //   const mockOrderCreationResponse = {
    //     data: {
    //       orderID: "MOCK-PAYPAL-ORDER-ID-12345", // This would be the actual PayPal order ID
    //     },
    //   };
    //   const orderCreationResponse = mockOrderCreationResponse;
    //   // --- End Mock API Call ---

    //   if (orderCreationResponse?.data?.orderID) {
    //     console.log("PayPal order created on backend:", orderCreationResponse.data.orderID);
    //     return orderCreationResponse.data.orderID; // Return the PayPal Order ID
    //   } else {
    //     setError("Failed to create PayPal order on backend. No order ID received.");
    //     return Promise.reject(new Error("Failed to create PayPal order"));
    //   }
    // } catch (err) {
    //   setError("An error occurred while initiating PayPal order creation.");
    //   console.error("Error creating PayPal order:", err);
    //   return Promise.reject(err); // Propagate error to PayPal SDK
    // }
  }

  function onApprove(data) {
    // replace this url with your server
    // return fetch(
    //   "https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       orderID: data.orderID,
    //     }),
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((orderData) => {
    //     // Your code here after capture the order
    //   });
  }

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
  console.log(
    "PayPalDetails component rendered with payment gateway:",
    paymentGateway
  );
  return (
    <>
      {paymentGateway && paymentGateway?.site?.settings?.client_id ? (
        <PayPalScriptProvider
          options={{
            clientId: paymentGateway.site.settings.client_id,
          }}
        >
          <PayPalButtons
            style={{ layout: "horizontal" }}
            disabled={false}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </PayPalScriptProvider>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default PayPalDetails;
