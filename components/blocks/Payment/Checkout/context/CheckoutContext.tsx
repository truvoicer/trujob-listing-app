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
    update: (data: any) => void;
    updateOrderItem: (id: number, data: Record<string, any>) => void;
    removeOrderItem?: (id: number) => void;
    addOrderItem?: (data: Record<string, any>) => void;
};
export const checkoutData = {
    order: null,
    price: null,
    paymentMethod: null,
    transaction: null,
    update: (data: CheckoutContextType) => {},
    updateOrderItem: (id: number, data: Record<string, any>) => {},
    removeOrderItem: (id: number) => {},
    addOrderItem: (data: Record<string, any>) => {}
};
export const CheckoutContext = createContext(checkoutData);