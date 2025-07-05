import { Ref, useContext, useEffect, useState } from "react";
import {
  CheckoutContext,
  CheckoutContextType,
  checkoutData,
  RefreshEntities,
} from "./context/CheckoutContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { Order } from "@/types/Cashier";
import { PaymentGateway } from "@/types/PaymentGateway";
import { Price } from "@/types/Price";
import PaymentProcess from "../PaymentProcess";

export type CheckoutProviderProps = {
  children: React.ReactNode;
  fetchOrder: () => Promise<Order | null>;
  fetchAvailablePaymentGateways: () => Promise<PaymentGateway | null>;
  fetchPrice: () => Promise<Price | null>;
};
function CheckoutProvider({
  children,
  fetchOrder,
  fetchAvailablePaymentGateways,
  fetchPrice,
}: CheckoutProviderProps) {
  const [checkoutState, setCheckoutState] = useState<CheckoutContextType>({
    ...checkoutData,
    update: updateCheckoutData,
    updateOrderItem: updateOrderItem,
    removeOrderItem: removeOrderItem,
    addOrderItem: addOrderItem,
    refresh: refreshEntity,
    fetchSelectedShippingMethod: fetchSelectedShippingMethod,
  });

  const notificationContext = useContext(AppNotificationContext);

  async function handleFetchOrder() {
    if (typeof fetchOrder !== "function") {
      console.error("fetchOrder is not a function");
      return;
    }
    const response = await fetchOrder();

    if (!response) {
      return false;
    }
    updateCheckoutData({
      order: response,
    });
  }

  async function handleFetchAvailablePaymentGateways() {
    if (typeof fetchAvailablePaymentGateways !== "function") {
      console.error("fetchAvailablePaymentGateways is not a function");
      return;
    }
    const response = await fetchAvailablePaymentGateways();
    if (!response) {
      return false;
    }
    updateCheckoutData({
      availablePaymentGateways: response,
    });
  }
  async function fetchTransaction() {}
  async function handleFetchPrice() {
    if (typeof fetchPrice !== "function") {
      console.error("fetchPrice is not a function");
      return;
    }
    const response = await fetchPrice();
    if (!response) {
      return false;
    }
    updateCheckoutData({
      price: response,
    });
  }

  async function handleFetchAvailableShippingMethods(
    checkoutContext: CheckoutContextType
  ) {
    let endpoint: string;
    if (!checkoutContext.order || !checkoutContext.order.id) {
      endpoint = UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderShippingMethod.replace(
          ":orderId",
          String(checkoutContext.order?.id)
        ),
      ]);
    } else {
      endpoint = UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderShippingMethod.replace(
          ":orderId",
          String(checkoutContext.order?.id)
        ),
      ]);
    }
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint,
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response || !response.data) {
      console.error(
        "Failed to fetch shipping methods. No response or data received."
      );
      return;
    }
    updateCheckoutData({
      availableShippingMethods: response.data,
    });
  }

  async function shippingMethodRequest(
    orderId: number,
    shippingMethodId: number
  ) {
    return await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderShippingMethod.replace(
          ":orderId",
          String(orderId)
        ),
        shippingMethodId,
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
  }

  async function fetchSelectedShippingMethod(
    id: number,
    checkoutContext: CheckoutContextType
  ) {
    if (!checkoutContext.order || !checkoutContext.order.id) {
      return;
    }
    if (!id) {
      return;
    }

    const response = await shippingMethodRequest(checkoutContext.order.id, id);

    if (!response || !response.data) {
      console.error(
        "Failed to fetch shipping methods. No response or data received."
      );
      return;
    }
    updateCheckoutData({
      selectedShippingMethod: response.data,
    });
  }

  async function handleFetchSelectedShippingMethod(
    checkoutContext: CheckoutContextType
  ) {
    if (!checkoutContext.order || !checkoutContext.order.id) {
      return;
    }
    if (
      !checkoutContext.selectedShippingMethod ||
      !checkoutContext.selectedShippingMethod.id
    ) {
      return;
    }

    const response = await shippingMethodRequest(
      checkoutContext.order.id,
      checkoutContext.selectedShippingMethod.id
    );

    if (!response || !response.data) {
      console.error(
        "Failed to fetch shipping methods. No response or data received."
      );
      return;
    }
    updateCheckoutData({
      selectedShippingMethod: response.data,
    });
  }

  async function handleFetchOrderSummary() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderSummary.replace(
          ":orderId",
          String(checkoutState.order?.id)
        ),
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response || !response.data) {
      console.error(
        "Failed to fetch order summary. No response or data received."
      );
      return;
    }
    updateCheckoutData({
      orderSummary: response.data,
    });
  }

  async function refreshEntity(
    entity: RefreshEntities,
    checkoutContext: CheckoutContextType
  ) {
    switch (entity) {
      case "order":
        await handleFetchOrder();
        break;
      case "transaction":
        await fetchTransaction();
        break;
      case "availablePaymentGateways":
        await handleFetchAvailablePaymentGateways();
        break;
      case "price":
        await handleFetchPrice();
        break;
      case "availableShippingMethods":
        await handleFetchAvailableShippingMethods(checkoutContext);
        break;
      case "orderSummary":
        await handleFetchOrderSummary();
        break;
      case "selectedShippingMethod":
        await handleFetchSelectedShippingMethod(checkoutContext);
        break;
      default:
        console.warn(`Unknown entity type: ${entity}`);
        break;
    }
  }
  async function addOrderItem(
    data: Record<string, any>,
    checkoutContext: CheckoutContextType
  ) {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderItem.replace(
          ":orderId",
          String(checkoutContext.order?.id)
        ),
        "store",
      ]),
      method: TruJobApiMiddleware.METHOD.POST,
      protectedReq: true,
      data: data,
    });
    if (!response || !response.data) {
      console.error("Failed to add order item. No response or data received.");
      return;
    }
    checkoutContext.refresh("order");
    refreshEntity("order");
  }
  function removeOrderItem(id: number, checkoutContext: CheckoutContextType) {
    const response = TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderItem.replace(
          ":orderId",
          String(checkoutContext.order?.id)
        ),
        id,
        "delete",
      ]),
      method: TruJobApiMiddleware.METHOD.DELETE,
      protectedReq: true,
    });
    if (!response) {
      console.error(
        `Failed to remove order item with id ${id}. No response received.`
      );
      return;
    }

    checkoutContext.refresh("order");
    refreshEntity("order");
  }
  function updateOrderItem(
    id: number,
    data: Record<string, any>,
    checkoutContext: CheckoutContextType
  ) {
    const response = TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderItem.replace(
          ":orderId",
          String(checkoutContext.order?.id)
        ),
        id,
        "update",
      ]),
      method: TruJobApiMiddleware.METHOD.PATCH,
      protectedReq: true,
      data: data,
    });
    if (!response) {
      console.error(
        `Failed to update order item with id ${id}. No response or data received.`
      );
      return;
    }
    checkoutContext.refresh("order");
    refreshEntity("order");
  }
  function updateCheckoutData(data: CheckoutContextType) {
    setCheckoutState((prevState: CheckoutContextType) => {
      let newState = { ...prevState };
      Object.keys(data).forEach((key) => {
        newState[key] = data[key];
      });
      return newState;
    });
  }

  useEffect(() => {
    handleFetchOrder();
    handleFetchAvailablePaymentGateways();
    handleFetchPrice();
  }, []);

  return (
    <CheckoutContext.Provider value={checkoutState}>
      <div className="checkout-provider">{children}</div>
    </CheckoutContext.Provider>
  );
}

export default CheckoutProvider;
