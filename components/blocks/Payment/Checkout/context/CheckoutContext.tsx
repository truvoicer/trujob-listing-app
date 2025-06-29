import { Address } from "@/components/blocks/Admin/User/Address/ManageAddress";
import { Order } from "@/types/Cashier";
import { PaymentGateway } from "@/types/PaymentGateway";
import { PaymentMethod } from "@/types/PaymentMethod";
import { Price } from "@/types/Price";
import { ShippingMethod } from "@/types/Shipping";
import { createContext } from "react";
import { select } from "underscore";

export type CheckoutContextType = {
    [key: string]: any | PaymentGateway | null;
    order: Order | null;
    price: Price | null;
    paymentMethod: PaymentGateway | null;
    transaction: any;
    availablePaymentGateways: PaymentMethod[] | null;
    selectedPaymentGateway: PaymentGateway | null;
    availableShippingMethods: ShippingMethod[];
    selectedShippingMethod: ShippingMethod | null;
    billingAddress: Address | null;
    shippingAddress: Address | null;
    refresh: (entity: 'order' | 'transaction' | 'paymentMethod' | 'price' | 'availableShippingMethods' | 'availablePaymentGateways') => Promise<void>;
    update: (data: any) => void;
    updateOrderItem: (id: number, data: Record<string, any>, checkoutContext: CheckoutContextType) => void;
    removeOrderItem?: (id: number, checkoutContext: CheckoutContextType) => void;
    addOrderItem?: (data: Record<string, any>, checkoutContext: CheckoutContextType) => void;
};
export const checkoutData = {
    order: null,
    price: null,
    transaction: null,
    availablePaymentGateways: null,
    selectedPaymentGateway: null,
    availableShippingMethods: [],
    selectedShippingMethod: null,
    billingAddress: null,
    shippingAddress: null,
    refresh: async (entity: 'order' | 'transaction' | 'paymentMethod' | 'price' | 'availableShippingMethods' | 'availablePaymentGateways') => {},
    update: (data: CheckoutContextType, checkoutContext: CheckoutContextType) => {},
    updateOrderItem: (id: number, data: Record<string, any>, checkoutContext: CheckoutContextType) => {},
    removeOrderItem: (id: number, checkoutContext: CheckoutContextType) => {},
    addOrderItem: (data: Record<string, any>, checkoutContext: CheckoutContextType) => {}
};
export const CheckoutContext = createContext(checkoutData);