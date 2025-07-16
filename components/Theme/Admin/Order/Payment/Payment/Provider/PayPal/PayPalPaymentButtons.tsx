import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import { useContext } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import Loader from "@/components/Loader";
import { PaymentDetailsProps, PaymentRequestType } from "../../Service/PaymentService";

function PayPalPaymentButtons({
  onSuccess,
  onError,
  onCancel,
}: PaymentDetailsProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const checkoutContext = useContext(CheckoutContext);
  const transaction = checkoutContext?.transaction;
  const order = checkoutContext?.order;
  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

  function handleError(
    type: PaymentRequestType,
    error: Error,
    data?: Record<string, unknown> | null
  ) {
    console.error("PayPal error:", error);
    if (typeof onError === "function") {
      onError(type, error, data);
    }
  }

  function handleSuccess(type: PaymentRequestType, data: Record<string, unknown>) {
    console.log("PayPal success:", data);
    if (typeof onSuccess === "function") {
      onSuccess(type, data);
    }
  }

  function handleCancel(type: PaymentRequestType, data: Record<string, unknown>) {
    console.warn("PayPal transaction cancelled:", data);
    if (typeof onCancel === "function") {
      onCancel(type, data);
    }
  }

  async function createOrder() {
    try {
      if (!order?.id) {
        handleError("order", new Error("Order ID is not available"));
        return Promise.reject(new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        handleError("order", new Error("Transaction ID is not available"));
        return Promise.reject(new Error("Transaction ID is not available"));
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
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

      if (orderCreationResponse?.data?.id) {
        handleSuccess("order", orderCreationResponse);
        return orderCreationResponse.data.id; // Return the PayPal Order ID
      } else {
        handleError(
          "order",
          new Error("Failed to create PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
        return Promise.reject(new Error("Failed to create PayPal order"));
      }
    } catch (err) {
      handleError(
        "order",
        err instanceof Error ? err : new Error("Unknown error")
      );
      return Promise.reject(err); // Propagate error to PayPal SDK
    }
  }

  async function onApprove(data: Record<string, unknown>) {
    try {
      if (!order?.id) {
        handleError("capture", new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        handleError("capture", new Error("Transaction ID is not available"));
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
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

      if (orderCreationResponse) {
        handleSuccess("capture", orderCreationResponse);
      } else {
        handleError(
          "capture",
          new Error("Failed to capture PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
      }
    } catch (err: unknown) {
      handleError(
        "capture",
        err instanceof Error ? err : new Error("Unknown error")
      );
    }
  }

  return (
    <>
      {isPending ? <Loader /> : null}
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
