import { Brand } from "../Brand";
import { category } from "../Category";
import { Color } from "../Color";
import { Media } from "../Media";
import { ProductType } from "../ProductType";
import { User } from "../User";

export type Listing = {
    id: number;
    name: string;
    title: string;
    description: string;
    active: boolean;
    allow_offers: boolean;
    quantity: number;
    listing_type: ListingType;
    listing_user: User;
    listing_follow: Array<ListingFollow>;
    listing_feature: Array<ListingFeature>;
    listing_review: Array<ListingReview>;
    listing_category: Array<ListingCategory>;
    listing_brand: Array<ListingBrand>;
    listing_color: Array<ListingColor>;
    listing_product_type: Array<ListingProductType>;
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
    label: string;
    value: string;
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
    category: category;
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