import { Country } from "./Country";
import { Currency } from "./Currency";
import { TaxRate } from "./Tax";
import { User } from "./User";

export type PriceType = {
    id: number;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
}

export type CreatePriceType = {
    name: string;
    label: string;
}
export type UpdatePriceType = {
    id: number;
    name?: string;
    label?: string;
}

export type Price = {
    id: number;
    created_by_user: User;
    country: Country;
    currency: Currency;
    price_type: PriceType;
    valid_from: string;
    valid_to: string;
    valid_from_timestamp: number;
    valid_to_timestamp: number;
    is_default: boolean;
    is_active: boolean;
    amount: number;
    tax_rates?: TaxRate[];
    discounts?: any[];
    created_at: string;
    updated_at: string;
}

export type PriceRequest = {
    country_id?: number;
    currency_id?: number;
    price_type_id?: number;
    created_by_user_id?: number;
    valid_from?: string;
    valid_to?: string;
    is_default?: boolean;
    is_active?: boolean;
    amount?: number;
    tax_rate_ids?: number[];
    discount_ids?: number[];
}

export type CreatePrice = {
}
export type UpdatePrice = {
    id: number;
    created_by_user_id?: number;
}