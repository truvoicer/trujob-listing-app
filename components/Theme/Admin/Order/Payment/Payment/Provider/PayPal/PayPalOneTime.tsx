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

function PayPalOneTime({
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
            intent: 'capture',
          }}
        >
          <PayPalPaymentButtons
            createOrder={createOrder}
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

export default PayPalOneTime;
