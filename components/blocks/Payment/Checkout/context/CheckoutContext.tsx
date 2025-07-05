import { Address } from "@/components/blocks/Admin/User/Address/ManageAddress";
import { Order, OrderSummary } from "@/types/Cashier";
import { PaymentGateway } from "@/types/PaymentGateway";
import { PaymentMethod } from "@/types/PaymentMethod";
import { Price } from "@/types/Price";
import { ShippingMethod, ShippingRate } from "@/types/Shipping";
import { createContext } from "react";

export type RefreshEntities = 'order' | 'transaction' | 'paymentMethod' | 'price' | 'availableShippingMethods' | 'availablePaymentGateways' | 'orderSummary' | 'selectedShippingMethod' | 'billingAddress' | 'shippingAddress';

export type CheckoutContextType = {
    [key: string]: any | PaymentGateway | null;
    order: Order | null;
    orderSummary: OrderSummary | null; 
    price: Price | null;
    paymentMethod: PaymentGateway | null;
    transaction: any;
    availablePaymentGateways: PaymentMethod[] | null;
    selectedPaymentGateway: PaymentGateway | null;
    availableShippingMethods: ShippingMethod[];
    selectedShippingMethod: ShippingMethod | null;
    selectedShippingRate: ShippingRate | null;
    billingAddress: Address | null;
    shippingAddress: Address | null;
    fetchSelectedShippingMethod: (id: number, checkoutContext: CheckoutContextType) => Promise<void>;
    refresh: (entity: RefreshEntities) => Promise<void>;
    update: (data: any) => void;
    updateOrderItem: (id: number, data: Record<string, any>, checkoutContext: CheckoutContextType) => void;
    removeOrderItem?: (id: number, checkoutContext: CheckoutContextType) => void;
    addOrderItem?: (data: Record<string, any>, checkoutContext: CheckoutContextType) => void;
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
    fetchSelectedShippingMethod: async (id: number, checkoutContext: CheckoutContextType) => {},
    refresh: async (entity: RefreshEntities, checkoutContext: CheckoutContextType) => {},
    update: (data: CheckoutContextType, checkoutContext: CheckoutContextType) => {},
    updateOrderItem: (id: number, data: Record<string, any>, checkoutContext: CheckoutContextType) => {},
    removeOrderItem: (id: number, checkoutContext: CheckoutContextType) => {},
    addOrderItem: (data: Record<string, any>, checkoutContext: CheckoutContextType) => {}
};
export const CheckoutContext = createContext(checkoutData);