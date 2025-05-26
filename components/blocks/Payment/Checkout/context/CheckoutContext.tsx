import { Order } from "@/types/Cashier";
import { PaymentGateway } from "@/types/PaymentGateway";
import { Price } from "@/types/Price";
import { createContext } from "react";

export type CheckoutContextType = {
    [key: string]: any | PaymentGateway | null;
    order: Order | null;
    price: Price | null;
    paymentMethod: PaymentGateway | null;
    transaction: any;
    refresh: (entity: 'order' | 'transaction' | 'paymentMethod' | 'price') => Promise<void>;
    update: (data: any) => void;
    updateOrderItem: (id: number, data: Record<string, any>, checkoutContext: CheckoutContextType) => void;
    removeOrderItem?: (id: number, checkoutContext: CheckoutContextType) => void;
    addOrderItem?: (data: Record<string, any>, checkoutContext: CheckoutContextType) => void;
};
export const checkoutData = {
    order: null,
    price: null,
    paymentMethod: null,
    transaction: null,
    refresh: async (entity: 'order' | 'transaction' | 'paymentMethod' | 'price') => {},
    update: (data: CheckoutContextType, checkoutContext: CheckoutContextType) => {},
    updateOrderItem: (id: number, data: Record<string, any>, checkoutContext: CheckoutContextType) => {},
    removeOrderItem: (id: number, checkoutContext: CheckoutContextType) => {},
    addOrderItem: (data: Record<string, any>, checkoutContext: CheckoutContextType) => {}
};
export const CheckoutContext = createContext(checkoutData);