import { Brand } from "./Brand";
import { Category } from "./Category";
import { Color } from "./Color";
import { Feature } from "./Feature";
import { Media } from "./Media";
import { Price } from "./Price";
import { ProductType } from "./ProductType";
import { Review } from "./Review";
import { User } from "./User";

export type Listing = {
    id: number;
    name: string;
    title: string;
    description: string;
    active: boolean;
    allow_offers: boolean;
    quantity: number;
    type: ListingType;
    user: User;
    follows: Array<ListingFollow>;
    features: Array<ListingFeature>;
    reviews: Array<ListingReview>;
    categories: Array<ListingCategory>;
    brands: Array<ListingBrand>;
    colors: Array<ListingColor>;
    product_types: Array<ListingProductType>;
    prices: Array<Price>;
    media: Array<Media>;
    created_at: string;
    updated_at: string;
}

export type ListingType = {
    id: number;
    name: string;
    label: string;
    description: string;
}

export type ListingFollow = {
    id: number;
    listing: Listing;
    user: User;
}
export type ListingFeature = {
    id: number;
    listing: Listing;
    feature: Feature;
}
export type ListingReview = {
    id: number;
    listing: Listing;
    user: User;
    rating: number;
    review: string;
    created_at: string;
    updated_at: string;
}
export type ListingCategory = {
    id: number;
    listing: Listing;
    category: Category;
}
export type ListingBrand = {
    id: number;
    listing: Listing;
    brand: Brand
}
export type ListingColor = {
    id: number;
    listing: Listing;
    color: Color;
}
export type ListingProductType = {
    id: number;
    listing: Listing;
    product_type: ProductType;
}   

export type ListingReviewRequest = {
    rating: number;
    review: string;
}
export interface CreateListingReview extends ListingReviewRequest {
}
export interface UpdateListingReview extends ListingReviewRequest {
    id: number;
}

export type ListingRequest = {
    name?: string;
    title?: string;
    description?: string;
    active?: boolean;
    allow_offers?: boolean;
    quantity?: number;
    user?: number;
    type?: number;
    follow_users?: Array<number>;
    features?: Array<number>;
    reviews?: Array<Review>;
    categories?: Array<number>;
    brands?: Array<number>;
    colors?: Array<number>;
    product_types?: Array<number>;
    media?: Array<Media>;
    prices?: Array<Price>;
}
export interface CreateListing extends ListingRequest {
    type: number;
    name: string;
    title: string;
    active: boolean;
}
export interface UpdateListing extends ListingRequest {
    id: number;
}