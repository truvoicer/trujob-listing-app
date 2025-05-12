export type ProductType = {
    id: number;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
}
export type ProductTypeRequest = {
    name: string;
    label: string;
}
export interface CreateProductType extends ProductTypeRequest {
}
export interface UpdateProductType extends ProductTypeRequest {
    id: number;
}