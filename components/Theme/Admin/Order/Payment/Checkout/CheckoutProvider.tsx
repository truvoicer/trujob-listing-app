import { useContext, useEffect, useState } from "react";
import {
  CheckoutContext,
  CheckoutContextType,
  checkoutData,
  RefreshEntities,
  UpdateCheckoutContext,
} from "./context/CheckoutContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { UpdateOrderRequest } from "@/types/Order";


export type CheckoutProviderProps = {
  children: React.ReactNode;
  initialStep?: string;
  orderId?: number;
};
function CheckoutProvider({
  initialStep,
  children,
  orderId,
}: CheckoutProviderProps) {
  const [checkoutState, setCheckoutState] = useState<CheckoutContextType>({
    ...checkoutData,
    update: updateCheckoutData,
    updateOrder: updateOrder,
    updateOrderItem: updateOrderItem,
    removeOrderItem: removeOrderItem,
    addOrderItem: addOrderItem,
    refresh: refreshEntity,
    fetchSelectedShippingMethod: fetchSelectedShippingMethod,
  });

  const notificationContext = useContext(AppNotificationContext);
  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

  async function handleFetchOrder(orderId?: number) {
    if (!orderId) {
      return;
    }
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.order,
        orderId,
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response?.data) {
      return false;
    }
    updateCheckoutData({
      order: response.data,
    });
  }

  async function handleFetchAvailablePaymentGateways() {
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.sitePaymentGateway,
        'available',
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response?.data) {
      console.error(
        "Failed to fetch available payment gateways. No response or data received."
      );
      return false;
    }
    updateCheckoutData({
      availablePaymentGateways: response.data,
    });
  }
  async function fetchTransaction() {}

  async function handleFetchAvailableShippingMethods(orderId?: number) {
    let endpoint: string;
    if (!orderId) {
      endpoint = UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderShippingMethod.replace(
          ":orderId",
          String(orderId)
        ),
      ]);
    } else {
      endpoint = UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderShippingMethod.replace(
          ":orderId",
          String(orderId)
        ),
      ]);
    }
    const response = await truJobApiMiddleware.resourceRequest({
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
    return await truJobApiMiddleware.resourceRequest({
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
  ) {
    if (!checkoutState.order || !checkoutState.order.id) {
      return;
    }
    if (!id) {
      return;
    }

    const response = await shippingMethodRequest(checkoutState.order.id, id);

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

  async function handleFetchSelectedShippingMethod() {
    if (!checkoutState.order || !checkoutState.order.id) {
      return;
    }
    if (
      !checkoutState.selectedShippingMethod ||
      !checkoutState.selectedShippingMethod.id
    ) {
      return;
    }

    const response = await shippingMethodRequest(
      checkoutState.order.id,
      checkoutState.selectedShippingMethod.id
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

  async function handleFetchOrderSummary(orderId?: number) {
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderSummary.replace(
          ":orderId",
          String(orderId)
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
    orderId?: number,
    entity: RefreshEntities,
  ) {
    switch (entity) {
      case "order":
        await handleFetchOrder(orderId);
        break;
      case "transaction":
        await fetchTransaction();
        break;
      case "availablePaymentGateways":
        await handleFetchAvailablePaymentGateways();
        break;
      case "availableShippingMethods":
        await handleFetchAvailableShippingMethods(orderId);
        break;
      case "orderSummary":
        await handleFetchOrderSummary(orderId);
        break;
      case "selectedShippingMethod":
        await handleFetchSelectedShippingMethod();
        break;
      default:
        console.warn(`Unknown entity type: ${entity}`);
        break;
    }
  }
  async function addOrderItem(
    orderId?: number,
    data: Record<string, unknown>,
  ) {
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderItem.replace(
          ":orderId",
          String(orderId)
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
    refreshEntity(orderId, "order");
  }
  async function removeOrderItem(orderId?: number, id: number) {
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderItem.replace(
          ":orderId",
          String(orderId)
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
    refreshEntity(orderId, "order");
  }
  async function updateOrderItem(
    orderId?: number,
    id: number,
    data: Record<string, unknown>,
  ) {
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.orderItem.replace(
          ":orderId",
          String(orderId)
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

    // Optionally, refresh the order to
    refreshEntity(orderId, "order");
  }
  async function updateOrder(
    orderId: number,
    data: UpdateOrderRequest,
  ) {
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.order,
        orderId,
        "update",
      ]),
      method: TruJobApiMiddleware.METHOD.PATCH,
      protectedReq: true,
      data: data,
    });
    if (!response) {
      console.error(
        `Failed to update order with id ${orderId}. No response or data received.`
      );
      return;
    }
    refreshEntity(orderId, "order");
  }
  function updateCheckoutData(data: UpdateCheckoutContext) {
    setCheckoutState((prevState: CheckoutContextType) => {
      let newState = { ...prevState };
      Object.keys(data).forEach((key) => {
        newState[key] = data[key];
      });
      return newState;
    });
  }

  useEffect(() => {
    handleFetchAvailablePaymentGateways();
  }, []);

  useEffect(() => {
    if (initialStep) {
      updateCheckoutData({
        currentStep: initialStep,
      });
    }
  }, [initialStep]);

  return (
    <CheckoutContext.Provider value={checkoutState}>
      <div className="checkout-provider">{children}</div>
    </CheckoutContext.Provider>
  );
}

export default CheckoutProvider;
