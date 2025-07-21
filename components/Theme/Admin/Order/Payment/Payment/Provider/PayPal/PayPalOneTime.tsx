import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { PaymentGateway } from "@/types/PaymentGateway";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { useContext, useEffect, useState } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import Loader from "@/components/Loader";
import PayPalPaymentButtons from "./PayPalPaymentButtons";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { PayPalPaymentDetailsProps, PayPalPaymentRequestType } from "../../Service/PayPalService";

function PayPalOneTime({
  showNext,
  showPrevious,
  goToNext,
}: PayPalPaymentDetailsProps) {
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

  function onSuccess(
    paymentRequestType: PayPalPaymentRequestType, 
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
    paymentRequestType: PayPalPaymentRequestType,
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
  
  async function createOrder() {
    try {
      if (!order?.id) {
        onError("order", new Error("Order ID is not available"));
        return Promise.reject(new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        onError("order", new Error("Transaction ID is not available"));
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

      if (orderCreationResponse?.data?.id) {
        onSuccess("order", orderCreationResponse);
        return orderCreationResponse.data.id; // Return the PayPal Order ID
      } else {
        onError(
          "order",
          new Error("Failed to create PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
        return Promise.reject(new Error("Failed to create PayPal order"));
      }
    } catch (err) {
      onError(
        "order",
        err instanceof Error ? err : new Error("Unknown error")
      );
      return Promise.reject(err); // Propagate error to PayPal SDK
    }
  }

  async function onApprove(data: Record<string, unknown>) {
    try {
      if (!order?.id) {
        onError("capture", new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        onError("capture", new Error("Transaction ID is not available"));
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig()
            .endpoints.paypal.order.replace(":orderId", order.id.toString())
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
        onSuccess("capture", orderCreationResponse);
      } else {
        onError(
          "capture",
          new Error("Failed to capture PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
      }
    } catch (err: unknown) {
      onError(
        "capture",
        err instanceof Error ? err : new Error("Unknown error")
      );
    }
  }

  async function onCancel(data: Record<string, unknown>) {
    console.log("PayPal onCancel data:", data);
    try {
      if (!order?.id) {
        onError("cancel", new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        onError("cancel", new Error("Transaction ID is not available"));
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
        onSuccess("cancel", orderCreationResponse);
      } else {
        onError(
          "cancel",
          new Error("Failed to cancel PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
      }
    } catch (err: unknown) {
      onError(
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
            onCancel={onCancel}
          />
        </PayPalScriptProvider>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default PayPalOneTime;
