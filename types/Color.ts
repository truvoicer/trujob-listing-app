export type Color = {
    id: number;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
}

export type ColorRequest = {
    name: string;
    label: string;
}
export interface CreateColor extends ColorRequest {
}
export interface UpdateColor extends ColorRequest {
    id: number;
}