export type Feature = {
    id: number;
    name: string;
    label: string;
    created_at: string;
    updated_at: string;
}
export type FeatureRequest = {
    name: string;
    label: string;
}
export interface CreateFeature extends FeatureRequest {
}
export interface UpdateFeature extends FeatureRequest {
    id: number;
}