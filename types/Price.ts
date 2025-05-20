import { Country } from "./Country";
import { Currency } from "./Currency";
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
    user: User;
    country: Country;
    currency: Currency;
    type: PriceType;
    valid_from: string;
    valid_to: string;
    is_default: boolean;
    is_active: boolean;
    amount: number;
}

export type PriceRequest = {
    country_id?: number;
    currency_id?: number;
    type_id?: number;
    valid_from?: string;
    valid_to?: string;
    is_default?: boolean;
    is_active?: boolean;
    amount?: number;
}

export type CreatePrice = {
}
export type UpdatePrice = {
    id: number;
    user_id?: number;
}