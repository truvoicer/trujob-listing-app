export type Category = {
    id: number;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
}

export type CategoryRequest = {
    name: string;
    label: string;
}
export interface CreateCategory extends CategoryRequest {
}
export interface UpdateCategory extends CategoryRequest {
    id: number;
}