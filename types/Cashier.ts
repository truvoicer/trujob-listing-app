import { Address } from "@/components/blocks/Admin/User/Address/ManageAddress";
import { Product } from "./Product";
import { PaymentGateway } from "./PaymentGateway";
import { Price } from "./Price";
import { User } from "./User";

export type Order = {
    id: number;
    user: User;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export type OrderItem = {
    id: number;
    quantity: number;
    order_itemable_id: number;
    order_itemable_type: string;
    entity: Product;
    created_at: string;
    updated_at: string;
}

export type Transaction = {
    id: number;
    user: User;
    price: Price;
    payment_gateway: PaymentGateway;
    billing_address: Address;
    shipping_address: Address;
    created_at: string;
    updated_at: string;
}