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
    shipping_zone: ShippingZone;
    currency: Currency;
    type: ShippingRateType;
    name: string;
    label: string;
    description: string;
    is_active: boolean;
    has_max_dimension: boolean;
    max_dimension: number;
    max_dimension_unit: 'cm' | 'm' | 'in' | 'ft';
    has_weight: boolean;
    has_height: boolean;
    has_width: boolean;
    has_depth: boolean;
    weight_unit: 'g' | 'kg' | 'lb' | 'oz';
    height_unit: 'cm' | 'm' | 'in' | 'ft';
    width_unit: 'cm' | 'm' | 'in' | 'ft';
    depth_unit: 'cm' | 'm' | 'in' | 'ft';
    max_weight: number;
    max_height: number;
    max_width: number;
    max_depth: number;
    amount: number;
    dimensional_weight_divisor?: number;
    created_at: string;
    updated_at: string;
}

export type ShippingRateRequest = {
    shipping_zone_id?: number;
    type?: 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';
    name?: string;
    label?: string;
    description?: string;
    is_active?: boolean;
    has_max_dimension?: boolean;
    max_dimension?: number;
    max_dimension_unit?: 'cm' | 'm' | 'in' | 'ft';
    has_weight?: boolean;
    has_height?: boolean;
    has_width?: boolean;
    has_depth?: boolean;
    weight_unit?: 'g' | 'kg' | 'lb' | 'oz';
    height_unit?: 'cm' | 'm' | 'in' | 'ft';
    width_unit?: 'cm' | 'm' | 'in' | 'ft';
    depth_unit?: 'cm' | 'm' | 'in' | 'ft';
    max_weight?: number;
    max_height?: number;
    max_width?: number;
    max_depth?: number;
    amount?: number;
    dimensional_weight_divisor?: number;
    currency_id?: number;
}
export interface CreateShippingRate extends ShippingRateRequest {
    shipping_zone_id: number;
    type: 'flat_rate' | 'free' | 'weight_based' | 'price_based' | 'dimension_based' | 'custom';
    amount: number;
    name: string;
    label: string;
    description: string;
    is_active: boolean;
    has_weight?: boolean;
    has_height?: boolean;
    has_width?: boolean;
    has_depth?: boolean;
    has_max_dimension?: boolean;
    max_dimension?: number;
    max_dimension_unit?: 'cm' | 'm' | 'in' | 'ft';
    weight_unit: 'g' | 'kg' | 'lb' | 'oz';
    height_unit: 'cm' | 'm' | 'in' | 'ft';
    width_unit: 'cm' | 'm' | 'in' | 'ft';
    depth_unit: 'cm' | 'm' | 'in' | 'ft';
    max_weight: number;
    max_height: number;
    max_width: number;
    max_depth: number;
    dimensional_weight_divisor?: number;
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
