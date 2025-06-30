import { Category } from "./Category";
import { Country } from "./Country";
import { Currency } from "./Currency";
import { Product } from "./Product";
import { Region } from "./Region";

export type ShippingMethod = {
    id: number;
    label: string;
    name: string;
    description: string;
    is_active: boolean;
    processing_time_days: number;
    display_order: number;
    rates: ShippingRate[];
    restrictions: ShippingRestriction[];
    created_at: string;
    updated_at: string;
}

export type ShippingMethodRequest = {
    name?: string;
    label?: string;
    description?: string;
    is_active?: boolean;
    processing_time_days?: number;
    display_order?: number;
    rates?: ShippingRateRequest[];
    restrictions?: ShippingRestrictionRequest[];
}
export interface CreateShippingMethod extends ShippingMethodRequest {
    name: string;
    label: string;
    description: string;
    is_active?: boolean;
    processing_time_days?: number;
    display_order?: number;
}
export interface UpdateShippingMethod extends ShippingMethodRequest {
    id: number;
}

export type ShippingZoneAbleType = 'country' | 'region' | 'currency' | 'category';
export type ShippingZoneAble = {
    id: number;
    shipping_zoneable_id: number;
    shipping_zoneable_type: ShippingZoneAbleType;
    created_at: string;
    updated_at: string;
}
export type ShippingZone = {
    id: number;
    name: string;
    label: string;
    shipping_zoneables: ShippingZoneAble[];
    all?: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export type ShippingZoneAbleRequest = {
    shipping_zoneable_id: number;
    shipping_zoneable_type: ShippingZoneAbleType;
}
export type ShippingZoneRequest = {
    name?: string;
    label?: string;
    shipping_zoneables?: ShippingZoneAbleRequest[];
    is_active?: boolean;
    all?: boolean;
}
export interface CreateShippingZone extends ShippingZoneRequest {
    name: string;
    label: string;
    shipping_zoneables: ShippingZoneAbleRequest[];
    is_active: boolean;
}
export interface UpdateShippingZone extends ShippingZoneRequest {
    id: number;
}

export type ShippingRateType = 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';

export type ShippingRate = {
    id: number;
    shipping_method: ShippingMethod;
    shipping_zone: ShippingZone;
    type: ShippingRateType;
    weight_limit: boolean;
    height_limit: boolean;
    length_limit: boolean;
    width_limit: boolean;
    weight_unit: string;
    height_unit: string;
    width_unit: string;
    length_unit: string;
    min_weight: number | null;
    max_weight: number | null;
    min_height: number | null;
    max_height: number | null;
    min_width: number | null;
    max_width: number | null;
    min_length: number | null;
    max_length: number | null;
    amount: number;
    currency: Currency;
    zone?: ShippingZone | null;
    created_at: string;
    updated_at: string;
}

export type ShippingRateRequest = {
    shipping_zone_id?: number;
    type?: 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';
    amount?: number;
    weight_unit?: string;
    height_unit?: string;
    width_unit?: string;
    length_unit?: string;
    weight_limit?: boolean;
    height_limit?: boolean;
    length_limit?: boolean;
    width_limit?: boolean;
    min_weight?: number | null;
    max_weight?: number | null;
    min_height?: number | null;
    max_height?: number | null;
    min_width?: number | null;
    max_width?: number | null;
    min_length?: number | null;
    max_length?: number | null;
    currency_id?: number;
}
export interface CreateShippingRate extends ShippingRateRequest {
    shipping_method_id: number;
    shipping_zone_id: number;
    type: 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';
    amount: number;
    currency_id: number;
}
export interface UpdateShippingRate extends ShippingRateRequest {
    id: number;
}

export type ShippingRestriction = {
    id: number;
    restrictionable_type: string;
    restrictionable_id: number;
    action: 'allow' | 'deny';
    category?: Category;
    product?: Product;
    country?: Country;
    region?: Region;
    currency?: Currency;
    created_at: string;
    updated_at: string;
}

export type BulkShippingRestriction = {
    restrictions?: {
        type: string;
        ids: number[];
    }[];
}

export interface ShippingRestrictionRequest extends BulkShippingRestriction {
    action?: 'allow' | 'deny';
}

export interface CreateShippingRestriction extends ShippingRestrictionRequest {
    restrictions: {
        type: string;
        ids: number[];
    }[];
    action: 'allow' | 'deny';
}

export interface UpdateShippingRestriction {
    id: number;
    action: 'allow' | 'deny';
}
