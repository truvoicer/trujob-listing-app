import { useContext, useEffect, useState } from "react";
import {
  PaymentDetailsProps,
  PaymentRequestType,
} from "../../Service/PaymentService";
import { PaymentGateway } from "@/types/PaymentGateway";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider, PaymentElement } from "@stripe/react-stripe-js";
import Loader from "@/components/Loader";

function StripeOneTime({ onSuccess, onError, onCancel }: PaymentDetailsProps) {
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(
    null
  );
  const [stripePromise, setStripePromise] = useState<Promise<unknown> | null>(
    null
  );
  const [checkoutSession, setCheckoutSession] = useState<Record<string, unknown> | null>(null);
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

  function handleSuccess(
    type: PaymentRequestType,
    data: Record<string, unknown>
  ) {
    console.log("PayPal success:", data);
    if (typeof onSuccess === "function") {
      onSuccess(type, data);
    }
  }

  function handleCancel(
    type: PaymentRequestType,
    data: Record<string, unknown>
  ) {
    console.warn("PayPal transaction cancelled:", data);
    if (typeof onCancel === "function") {
      onCancel(type, data);
    }
  }

  async function createOrder() {
    try {
      if (!order?.id) {
        handleError("order", new Error("Order ID is not available"));
        return;
      }
      if (!transaction?.id) {
        handleError("order", new Error("Transaction ID is not available"));
        return;
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig()
            .endpoints.stripe.order.replace(":orderId", order.id.toString())
            .replace(":transactionId", transaction.id.toString()),
            'checkout-session',
          "store",
        ]),
        method: TruJobApiMiddleware.METHOD.POST,
        protectedReq: true,
        encrypted: true,
      });

      if (orderCreationResponse?.data) {
        handleSuccess("order", orderCreationResponse);
        setCheckoutSession(orderCreationResponse.data);
      } else {
        handleError(
          "order",
          new Error("Failed to create PayPal order"),
          truJobApiMiddleware.getResponseData()
        );
      }
    } catch (err) {
      handleError(
        "order",
        err instanceof Error ? err : new Error("Unknown error")
      );
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
        data,
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

  async function fetchClientSecret() {
    if (!paymentGateway || !paymentGateway.site?.settings?.secret_key) {
      console.error("Payment gateway or secret key is not available");
      return Promise.reject(
        new Error("Payment gateway or secret key is not available")
      );
    }
    return Promise.resolve(paymentGateway.site.settings.secret_key as string);
  }

  useEffect(() => {
    sitePaymentGatewayRequest();
  }, []);
  useEffect(() => {
    createOrder();
  }, []);

  useEffect(() => {
    if (!paymentGateway) return;
    if (!paymentGateway.site?.settings?.publishable_key) {
      console.error(
        "Stripe client ID is not available in payment gateway settings"
      );
      return;
    }
    setStripePromise(
      loadStripe(paymentGateway.site.settings.publishable_key as string)
    );
  }, [paymentGateway]);

  const userCurrency = LocaleService.getUserCurrency();

  console.log(
    "stripe Details component rendered with payment gateway:",
    stripePromise,
    checkoutSession
  );

  return (
    <>
      {stripePromise && paymentGateway && paymentGateway?.site?.settings?.publishable_key ? (
        <CheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
          <form>
            <PaymentElement 


            />
            <button>Submit</button>
          </form>
        </CheckoutProvider>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default StripeOneTime;
