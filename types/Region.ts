import { Country } from "./Country";

export type Region = {
    id: number;
    country: Country;
    name: string;
    code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export type RegionRequest = {
    name?: string;
    code?: string;
    country_id?: number;
    is_active?: boolean;
}
export interface CreateRegion extends RegionRequest {
    name: string;
    code: string;
    country_id: number;
    is_active?: boolean;
}
export interface UpdateRegion extends RegionRequest {
    id: number;
}