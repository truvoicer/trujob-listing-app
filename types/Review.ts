export type Review = {
    id: number;
    review: string;
    rating: number;
    created_at: string;
    updated_at: string;
}
export type ReviewRequest = {
    
}
export interface CreateReview extends ReviewRequest {
    review: string;
    rating: number;
}
export interface UpdateReview extends ReviewRequest {
    id: number;
    review?: string;
    rating?: number;
}