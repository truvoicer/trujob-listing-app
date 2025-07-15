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

export type PayPalPaymentButtonsProps = {};
function PayPalPaymentButtons({}: PayPalPaymentButtonsProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const checkoutContext = useContext(CheckoutContext);
  const transaction = checkoutContext?.transaction;
  const order = checkoutContext?.order;

  async function createOrder() {
    try {
      if (!order?.id) {
        console.error("Order ID is not available");
        return Promise.reject(new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        console.error("Transaction ID is not available");
        return Promise.reject(new Error("Transaction ID is not available"));
      }
      console.log("Calling backend to create PayPal order...");
      // In your real app, use TruJobApiMiddleware:
      const orderCreationResponse =
        await TruJobApiMiddleware.getInstance().resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            TruJobApiMiddleware.getConfig()
              .endpoints.payPalOrder.replace(":orderId", order.id.toString())
              .replace(":transactionId", transaction.id.toString()),
            "store",
          ]),
          method: TruJobApiMiddleware.METHOD.POST,
          protectedReq: true,
          encrypted: true,
        });
      console.log("Order creation response:", orderCreationResponse);
      if (orderCreationResponse?.data?.id) {
        console.log(
          "PayPal order created on backend:",
          orderCreationResponse.data.id
        );
        return orderCreationResponse.data.id; // Return the PayPal Order ID
      } else {
        console.error("Failed to create PayPal order:", orderCreationResponse);
        return Promise.reject(new Error("Failed to create PayPal order"));
      }
    } catch (err) {
      console.error("Error creating PayPal order:", err);
      return Promise.reject(err); // Propagate error to PayPal SDK
    }
  }

  async function onApprove(data) {
    try {
      if (!order?.id) {
        console.error("Order ID is not available");
        return Promise.reject(new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        console.error("Transaction ID is not available");
        return Promise.reject(new Error("Transaction ID is not available"));
      }
      console.log("Calling backend to create PayPal order...");
      // In your real app, use TruJobApiMiddleware:
      const orderCreationResponse =
        await TruJobApiMiddleware.getInstance().resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            TruJobApiMiddleware.getConfig()
              .endpoints.payPalOrder.replace(":orderId", order.id.toString())
              .replace(":transactionId", transaction.id.toString()),
            "capture",
            "store",
          ]),
          method: TruJobApiMiddleware.METHOD.POST,
          protectedReq: true,
          encrypted: true,
          data: {
            order_id: data.orderID,
            payer_id: data.payerID,
          },
        });

      console.log("Order capture creation response:", orderCreationResponse);
      if (orderCreationResponse) {
        console.log(
          "PayPal order capture created on backend:",
          orderCreationResponse
        );
      } else {
        console.error(
          "Failed to create PayPal order capture:",
          orderCreationResponse
        );
      }
    } catch (err) {
      console.error("Error capturing PayPal order:", err);
    }
  }

  return (
    <>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        disabled={false}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </>
  );
}

export default PayPalPaymentButtons;
