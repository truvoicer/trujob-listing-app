import { Order, OrderSummary, UpdateOrderRequest } from "@/types/Order";
import { PaymentGateway } from "@/types/PaymentGateway";
import { PriceType } from "@/types/Price";
import { ShippingMethod, ShippingRate } from "@/types/Shipping";
import { createContext } from "react";

export type RefreshEntities = 'order' | 'transaction' | 'paymentMethod' | 'priceType' | 'availableShippingMethods' | 'availablePaymentGateways' | 'orderSummary' | 'selectedShippingMethod';

export type CheckoutContextType = {
    [key: string]: unknown | PaymentGateway | null;
    currentStep: string | null;
    order: Order | null;
    orderSummary: OrderSummary | null; 
    priceType: PriceType | null;
    transaction: Record<string, unknown> | null;
    availablePaymentGateways: PaymentGateway[] | null;
    selectedPaymentGateway: PaymentGateway | null;
    availableShippingMethods: ShippingMethod[];
    selectedShippingMethod: ShippingMethod | null;
    selectedShippingRate: ShippingRate | null;
    fetchSelectedShippingMethod: (id: number) => Promise<void>;
    refresh: (orderId: number, entity: RefreshEntities) => Promise<void>;
    update: (data: UpdateCheckoutContext) => void;
    updateOrder: (orderId: number, data: UpdateOrderRequest) => void;
    updateOrderItem: (orderId: number, id: number, data: Record<string, unknown>) => void;
    removeOrderItem?: (orderId: number, id: number) => void;
    addOrderItem?: (orderId: number, data: Record<string, unknown>) => void;
};
export interface UpdateCheckoutContext {
    currentStep?: string | null;
    order?: Order | null;
    orderSummary?: OrderSummary | null; 
    priceType?: PriceType | null;
    transaction?: Record<string, unknown> | null;
    availablePaymentGateways?: PaymentGateway[] | null;
    selectedPaymentGateway?: PaymentGateway | null;
    availableShippingMethods?: ShippingMethod[];
    selectedShippingMethod?: ShippingMethod | null;
    selectedShippingRate?: ShippingRate | null;
}
export const checkoutData = {
    currentStep: null,
    order: null,
    orderSummary: null,
    priceType: null,
    transaction: null,
    availablePaymentGateways: null,
    selectedPaymentGateway: null,
    availableShippingMethods: [],
    selectedShippingMethod: null,
    selectedShippingRate: null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchSelectedShippingMethod: async (id: number) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refresh: async (orderId: number, entity: RefreshEntities) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: (data: UpdateCheckoutContext) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateOrder: (orderId: number, data: UpdateOrderRequest) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateOrderItem: (orderId: number, id: number, data: Record<string, unknown>) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeOrderItem: (orderId: number, id: number) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addOrderItem: (orderId: number, data: Record<string, unknown>) => {}
};
export const CheckoutContext = createContext(checkoutData);