export type Brand = {
    id: number;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
}

export type BrandRequest = {
    name: string;
    label: string;
}
export interface CreateBrand extends BrandRequest {
}

export interface UpdateBrand extends BrandRequest {
    id: number;
}