export type Review = {
    id: number;
    review: string;
    rating: string;
    created_at: string;
    updated_at: string;
}
export type ReviewRequest = {
    name: string;
    label: string;
}
export interface CreateReview extends ReviewRequest {
}
export interface UpdateReview extends ReviewRequest {
    id: number;
}