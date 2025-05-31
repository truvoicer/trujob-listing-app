import { Currency } from "./Currency";
import { ProductType } from "./ProductType";

export type Discount = {
    id: number;
    name: string;
    description: string;
    type: 'fixed' | 'percentage';
    amount: number;
    rate: number;
    currency: Currency;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    usage_limit: number;
    per_user_limit: number;
    min_order_amount: number;
    min_items_quantity: number;
    scope: 'global' | 'order' | 'product' | 'category' | 'shipping';
    code: string;
    is_code_required: boolean;
    created_at: string;
    updated_at: string;
}
export type DiscountProduct = {
    product_id: 'listing' | 'category' | 'shipping';
    product_type: string;
    price_id: number;
}

export type DiscountRequest = {
    name?: string;
    description?: string;
    type?: 'fixed' | 'percentage';
    amount?: number;
    rate?: number;
    currency_id?: number;
    starts_at?: string;
    ends_at?: string;
    is_active?: boolean;
    usage_limit?: number;
    per_user_limit?: number;
    min_order_amount?: number;
    min_items_quantity?: number;
    scope?: 'global' | 'order' | 'product' | 'category' | 'shipping';
    code?: string;
    is_code_required?: boolean;
    categories?: number[];
}

export interface CreateDiscount extends DiscountRequest {
    name: string;
    description: string;
    type: 'fixed' | 'percentage';
    amount: number;
    rate: number;
    currency_id: number;
    starts_at?: string;
    ends_at?: string;
    is_active?: boolean;
    usage_limit?: number;
    per_user_limit?: number;
    min_order_amount?: number;
    min_items_quantity?: number;
    scope?: 'global' | 'order' | 'product' | 'category' | 'shipping';
    code?: string;
    is_code_required?: boolean;
}
export interface UpdateDiscount extends DiscountRequest {
    id: number;
}
