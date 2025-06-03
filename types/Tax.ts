import { Country } from "./Country";
import { Currency } from "./Currency";
import { Region } from "./Region";

export type TaxRate = {
    id: number;
    name: string;
    type: 'vat' | 'duty' |'service' | 'excise' | 'sales_tax' | 'other';
    amount: number | null;
    rate: number | null;
    country: Country;
    currency: Currency;
    has_region: boolean;
    region: Region;
    is_default: boolean;
    scope: 'shipping' | 'product' | 'all';
    is_active: boolean;
    fixed_rate: boolean;
    created_at: string;
    updated_at: string;
}

export type TaxRateRequest = {
    name?: string;
    type?: 'vat' | 'duty' | 'service' | 'excise' | 'sales_tax' | 'other';
    amount?: number | null;
    rate?: number | null;
    country_id?: number;
    currency_id?: number;
    has_region?: boolean;
    region_id?: number;
    is_default?: boolean;
    scope?: 'shipping' | 'product' | 'all';
    is_active?: boolean;
    fixed_rate?: boolean;
}
export interface CreateTaxRate extends TaxRateRequest {
    name: string;
    type: 'vat' | 'duty' | 'service' | 'excise' | 'sales_tax' | 'other';
    amount?: number | null;
    rate?: number | null;
    country_id: number;
    currency_id?: number;
    has_region?: boolean;
    region_id?: number;
    is_default?: boolean;
    scope?: 'shipping' | 'product' | 'all';
    is_active?: boolean;
    fixed_rate?: boolean;
}
export interface UpdateTaxRate extends TaxRateRequest {
    id: number;
}