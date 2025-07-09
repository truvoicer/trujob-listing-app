import { Address } from "@/components/blocks/Admin/User/Address/ManageAddress";
import { Order, OrderSummary } from "@/types/Cashier";
import { PaymentGateway } from "@/types/PaymentGateway";
import { PaymentMethod } from "@/types/PaymentMethod";
import { Price } from "@/types/Price";
import { ShippingMethod, ShippingRate } from "@/types/Shipping";
import { createContext } from "react";

export type RefreshEntities = 'order' | 'transaction' | 'paymentMethod' | 'price' | 'availableShippingMethods' | 'availablePaymentGateways' | 'orderSummary' | 'selectedShippingMethod' | 'billingAddress' | 'shippingAddress';

export type CheckoutContextType = {
    [key: string]: unknown | PaymentGateway | null;
    order: Order | null;
    orderSummary: OrderSummary | null; 
    price: Price | null;
    transaction: Record<string, unknown> | null;
    availablePaymentGateways: PaymentGateway[] | null;
    selectedPaymentGateway: PaymentGateway | null;
    availableShippingMethods: ShippingMethod[];
    selectedShippingMethod: ShippingMethod | null;
    selectedShippingRate: ShippingRate | null;
    billingAddress: Address | null;
    shippingAddress: Address | null;
    fetchSelectedShippingMethod: (id: number) => Promise<void>;
    refresh: (orderId: number, entity: RefreshEntities) => Promise<void>;
    updateCheckoutData: (data: CheckoutContextType) => void;
    updateOrderItem: (orderId: number, id: number, data: Record<string, unknown>) => void;
    removeOrderItem?: (orderId: number, id: number) => void;
    addOrderItem?: (data: Record<string, unknown>) => void;
};
export const checkoutData = {
    order: null,
    orderSummary: null,
    price: null,
    transaction: null,
    availablePaymentGateways: null,
    selectedPaymentGateway: null,
    availableShippingMethods: [],
    selectedShippingMethod: null,
    selectedShippingRate: null,
    billingAddress: null,
    shippingAddress: null,
    fetchSelectedShippingMethod: async (id: number) => {},
    refresh: async (orderId: number, entity: RefreshEntities) => {},
    updateCheckoutData: (data: CheckoutContextType) => {},
    updateOrderItem: (orderId: number, id: number, data: Record<string, unknown>) => {},
    removeOrderItem: (orderId: number, id: number) => {},
    addOrderItem: (orderId: number, data: Record<string, unknown>) => {}
};
export const CheckoutContext = createContext(checkoutData);