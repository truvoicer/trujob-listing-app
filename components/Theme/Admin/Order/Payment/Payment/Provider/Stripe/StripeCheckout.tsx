import { useContext, useEffect, useState } from "react";
import { PaymentGateway } from "@/types/PaymentGateway";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import Loader from "@/components/Loader";
import {
  StripePaymentDetailsProps,
  StripePaymentRequestType,
} from "../../Service/StripeService";
import StripeCheckoutForm from "./StripeCheckoutForm";

function StripeCheckout({
  checkoutType,
  showNext,
  showPrevious,
  goToNext,
}: StripePaymentDetailsProps) {
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(
    null
  );
  const [stripePromise, setStripePromise] = useState<Promise<unknown> | null>(
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

  async function fetchClientSecret() {
    try {
      if (!order?.id) {
        onError("checkout-session", new Error("Order ID is not available"));
        return Promise.reject(new Error("Order ID is not available"));
      }
      if (!transaction?.id) {
        onError(
          "checkout-session",
          new Error("Transaction ID is not available")
        );
        return Promise.reject(new Error("Transaction ID is not available"));
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig()
            .endpoints.stripe.order.replace(":orderId", order.id.toString())
            .replace(":transactionId", transaction.id.toString()),
          "checkout-session",
          "store",
        ]),
        method: TruJobApiMiddleware.METHOD.POST,
        protectedReq: true,
        encrypted: true,
        data: {
          checkout_type: checkoutType,
        },
      });

      if (orderCreationResponse?.data?.client_secret) {
        return orderCreationResponse.data.client_secret; // Return the Stripe Checkout Session ID
      } else {
        onError(
          "checkout-session",
          new Error("Failed to create Stripe order"),
          truJobApiMiddleware.getResponseData()
        );
        return Promise.reject(new Error("Failed to create Stripe order"));
      }
    } catch (err) {
      onError(
        "checkout-session",
        err instanceof Error ? err : new Error("Unknown error")
      );
      return Promise.reject(
        err instanceof Error ? err : new Error("Unknown error")
      );
    }
  }
  async function sendApprovalRequest(data: Record<string, unknown>) {
    try {
      if (!order?.id) {
        console.error("Order ID is not available");
        return false;
      }
      if (!transaction?.id) {
        console.error("Transaction ID is not available");
        return false;
      }
      if (!data || !data.id) {
        console.error("Data or ID is not available for approval request");
        return false;
      }
      console.log("Sending approval request with data:", data);

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig()
            .endpoints.stripe.order.replace(":orderId", order.id.toString())
            .replace(":transactionId", transaction.id.toString()),
          "checkout-session",
          "approve",
          "store",
        ]),
        method: TruJobApiMiddleware.METHOD.POST,
        protectedReq: true,
        encrypted: true,
        data: {
          id: data.id, // Use the 'id' field from the data object
        }
      });

      if (orderCreationResponse?.data?.status === "complete") {
        return true;
      } else {
        console.error(
          "Failed to save successful Stripe request",
          orderCreationResponse
        );
        return false;
      }
    } catch (err) {
      console.error(
        "Error saving successful Stripe request:",
        err instanceof Error ? err.message : "Unknown error"
      );
      return false;
    }
  }
  async function sendCancelledRequest(data: Record<string, unknown>) {
    try {
      if (!order?.id) {
        console.error("Order ID is not available");
        return false;
      }
      if (!transaction?.id) {
        console.error("Transaction ID is not available");
        return false;
      }

      const orderCreationResponse = await truJobApiMiddleware.resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig()
            .endpoints.stripe.order.replace(":orderId", order.id.toString())
            .replace(":transactionId", transaction.id.toString()),
          "checkout-session",
          "cancel",
          "store",
        ]),
        method: TruJobApiMiddleware.METHOD.POST,
        protectedReq: true,
        encrypted: true,
        data,
      });

      if (orderCreationResponse?.data?.client_secret) {
        return true;
      } else {
        console.error(
          "Failed to save successful Stripe request",
          truJobApiMiddleware.getResponseData()
        );
        return false;
      }
    } catch (err) {
      console.error(
        "Error saving successful Stripe request:",
        err instanceof Error ? err.message : "Unknown error"
      );
      return false;
    }
  }

  async function onSuccess(
    paymentRequestType: StripePaymentRequestType,
    data: Record<string, unknown>
  ) {
    let response: boolean | undefined;
    switch (paymentRequestType) {
      case "checkout-session":
        console.log(
          "Stripe checkout session successful:",
          paymentRequestType,
          data
        );
        response = await sendApprovalRequest(data);
        if (!response) {
          console.error("Failed to save successful Stripe request");
          return;
        }
        if (typeof goToNext === "function") {
          goToNext();
        }
        break;
      case "payment":
        console.log("Stripe payment successful:", paymentRequestType, data);
        response = await sendApprovalRequest(data);
        if (!response) {
          console.error("Failed to save successful Stripe request");
          return;
        }
        if (typeof goToNext === "function") {
          goToNext();
        }
        break;
      default:
        console.error(
          "Stripe success: Unknown payment request type:",
          paymentRequestType
        );
    }
  }

  function onError(
    paymentRequestType: StripePaymentRequestType,
    error: Error,
    data?: Record<string, unknown> | null
  ) {
    switch (paymentRequestType) {
      case "checkout-session":
        console.log("Stripe checkout session error:", paymentRequestType, data);
        break;
      case "payment":
        console.log("Stripe payment error:", paymentRequestType, data);
        break;
      default:
        console.error(
          "Stripe error: Unknown payment request type:",
          paymentRequestType
        );
    }
  }
  async function onCancel(
    paymentRequestType: StripePaymentRequestType,
    data: Record<string, unknown>
  ) {
    let response: boolean | undefined;
    switch (paymentRequestType) {
      case "checkout-session":
        console.log(
          "Stripe checkout session cancelled:",
          paymentRequestType,
          data
        );
        response = await sendCancelledRequest(data);
        if (!response) {
          console.error("Failed to save cancelled Stripe request");
          return;
        }
        break;
      case "payment":
        console.log("Stripe payment cancelled:", paymentRequestType, data);
        response = await sendCancelledRequest(data);
        if (!response) {
          console.error("Failed to save cancelled Stripe request");
          return;
        }
        break;
      default:
        console.error(
          "Stripe cancel: Unknown payment request type:",
          paymentRequestType
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
        data,
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
    stripePromise
  );

  return (
    <>
      {stripePromise &&
      paymentGateway &&
      paymentGateway?.site?.settings?.publishable_key ? (
        <CheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <StripeCheckoutForm
            checkoutType={checkoutType}
            onSuccess={onSuccess}
            onError={onError}
            onCancel={onCancel}
            goToNext={goToNext}
            showNext={showNext}
            showPrevious={showPrevious}
          />
        </CheckoutProvider>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default StripeCheckout;
