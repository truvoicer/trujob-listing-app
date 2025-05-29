import { Category } from "./Category";
import { Country } from "./Country";
import { Currency } from "./Currency";
import { Listing } from "./Listing";
import { Region } from "./Region";

export type ShippingMethod = {
    id: number;
    carrier: string;
    description: string;
    is_active: boolean;
    processing_time_days: number;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export type ShippingMethodRequest = {
    name?: string;
    carrier?: string;
    description?: string;
    is_active?: boolean;
    processing_time_days?: number;
    display_order?: number;
}
export interface CreateShippingMethod extends ShippingMethodRequest {
    name: string;
    carrier: string;
    description: string;
    is_active?: boolean;
    processing_time_days?: number;
    display_order?: number;
}
export interface UpdateShippingMethod extends ShippingMethodRequest {
    id: number;
}

export type ShippingZone = {
    id: number;
    name: string;
    countries: Country[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export type ShippingZoneRequest = {
    name?: string;
    country_ids?: number[];
    is_active?: boolean;
}
export interface CreateShippingZone extends ShippingZoneRequest {
    name: string;
    country_ids: number[];
    is_active?: boolean;
}
export interface UpdateShippingZone extends ShippingZoneRequest {
    id: number;
}

export type ShippingRate = {
    id: number;
    shipping_method: ShippingMethod;
    shipping_zone: ShippingZone;
    rate_type: 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';
    min_value: number;
    max_value: number;
    rate_amount: number;
    currency: Currency;
    is_free_shipping_possible: boolean;
    created_at: string;
    updated_at: string;
}

export type ShippingRateRequest = {
    shipping_method_id?: number;
    shipping_zone_id?: number;
    rate_type?: 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';
    min_value?: number;
    max_value?: number;
    rate_amount?: number;
    currency_id?: number;
    is_free_shipping_possible?: boolean;
}
export interface CreateShippingRate extends ShippingRateRequest {
    shipping_method_id: number;
    shipping_zone_id: number;
    rate_type: 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';
    min_value?: number;
    max_value?: number;
    rate_amount: number;
    currency_id: number;
    is_free_shipping_possible?: boolean;
}
export interface UpdateShippingRate extends ShippingRateRequest {
    id: number;
}

export type ShippingRestriction = {
    id: number;
    shipping_method: ShippingMethod;
    restrictionable_type: string;
    restrictionable_id: string;
    action: ShippingMethod;
    category?: Category;
    listing?: Listing;
    country?: Country;
    region?: Region;
    currency?: Currency;
    created_at: string;
    updated_at: string;
}

export type ShippingRestrictionRequest = {
    shipping_method_id?: number;
    type?: string;
    restriction_id?: string;
    action?: 'allow' | 'deny';
}

export interface CreateShippingRestriction extends ShippingRestrictionRequest {
    shipping_method_id: number;
    type: string;
    restriction_id: string;
    action: 'allow' | 'deny';
}

export interface UpdateShippingRestriction extends ShippingRestrictionRequest {
    id: number;
}
