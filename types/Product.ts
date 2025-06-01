import { Brand } from "./Brand";
import { Category } from "./Category";
import { Color } from "./Color";
import { Feature } from "./Feature";
import { Media } from "./Media";
import { Price } from "./Price";
import { Review } from "./Review";
import { User } from "./User";

export type Product = {
    id: number;
    name: string;
    title: string;
    description: string;
    active: boolean;
    allow_offers: boolean;
    quantity: number;
    type: ProductType;
    user: User;
    follows: Array<ProductFollow>;
    features: Array<ProductFeature>;
    reviews: Array<ProductReview>;
    categories: Array<ProductCategory>;
    brands: Array<ProductBrand>;
    colors: Array<ProductColor>;
    product_types: Array<ProductProductType>;
    prices: Array<Price>;
    media: Array<Media>;
    created_at: string;
    updated_at: string;
}

export type ProductRequest = {
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
export interface CreateProduct extends ProductRequest {
    type: number;
    name: string;
    title: string;
    active: boolean;
}
export interface UpdateProduct extends ProductRequest {
    id: number;
}
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

export type ProductFollow = {
    id: number;
    product: Product;
    user: User;
}
export type ProductFeature = {
    id: number;
    product: Product;
    feature: Feature;
}
export type ProductReview = {
    id: number;
    product: Product;
    user: User;
    rating: number;
    review: string;
    created_at: string;
    updated_at: string;
}
export type ProductCategory = {
    id: number;
    product: Product;
    category: Category;
}
export type ProductBrand = {
    id: number;
    product: Product;
    brand: Brand
}
export type ProductColor = {
    id: number;
    product: Product;
    color: Color;
}
export type ProductProductType = {
    id: number;
    product: Product;
    product_type: ProductType;
}   

export type ProductReviewRequest = {
    rating: number;
    review: string;
}
export interface CreateProductReview extends ProductReviewRequest {
}
export interface UpdateProductReview extends ProductReviewRequest {
    id: number;
}
