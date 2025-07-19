import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { PaymentGateway } from "@/types/PaymentGateway";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { useContext, useEffect, useState } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import Loader from "@/components/Loader";
import PayPalPaymentButtons from "./PayPalPaymentButtons";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { PaymentDetailsProps, PaymentRequestType } from "../../Service/PaymentService";

function PayPalSubscription({
  onSuccess,
  onError,
  onCancel,
}: PaymentDetailsProps) {
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(
    null
  );
  const checkoutContext = useContext(CheckoutContext);
  const transaction = checkoutContext?.transaction;
  const order = checkoutContext?.order;
  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();



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

  async function createSubscription() {
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
            .endpoints.paypal.order.replace(":orderId", order.id.toString())
            .replace(":transactionId", transaction.id.toString()),
          "store",
        ]),
        method: TruJobApiMiddleware.METHOD.POST,
        protectedReq: true,
        encrypted: true,
      });
      console.log("PayPal order creation response:", orderCreationResponse);

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
    console.log("PayPal onApprove data:", data);
    try {
      if (!order?.id) {
        handleError("approve", new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        handleError("approve", new Error("Transaction ID is not available"));
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig()
            .endpoints.paypal.order.replace(":orderId", order.id.toString())
            .replace(":transactionId", transaction.id.toString()),
          "approve",
          "store",
        ]),
        method: TruJobApiMiddleware.METHOD.POST,
        protectedReq: true,
        encrypted: true,
        data
      });

      if (orderCreationResponse) {
        handleSuccess("approve", orderCreationResponse);
      } else {
        handleError(
          "approve",
          new Error("Failed to approve PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
      }
    } catch (err: unknown) {
      handleError(
        "approve",
        err instanceof Error ? err : new Error("Unknown error")
      );
    }
  }

  async function onCancel(data: Record<string, unknown>) {
    console.log("PayPal onCancel data:", data);
    try {
      if (!order?.id) {
        handleError("cancel", new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        handleError("cancel", new Error("Transaction ID is not available"));
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig()
            .endpoints.paypal.order.replace(":orderId", order.id.toString())
            .replace(":transactionId", transaction.id.toString()),
          "cancel",
          "store",
        ]),
        method: TruJobApiMiddleware.METHOD.POST,
        protectedReq: true,
        encrypted: true,
        data
      });

      if (orderCreationResponse) {
        handleSuccess("cancel", orderCreationResponse);
      } else {
        handleError(
          "cancel",
          new Error("Failed to cancel PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
      }
    } catch (err: unknown) {
      handleError(
        "cancel",
        err instanceof Error ? err : new Error("Unknown error")
      );
    }
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
            intent: 'subscription',
            vault: true,
          }}
        >
          <PayPalPaymentButtons
            createSubscription={createSubscription}
            onApprove={onApprove}
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
            onCancel={onCancel}
          />
        </PayPalScriptProvider>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default PayPalSubscription;
