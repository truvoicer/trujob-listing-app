import { Brand } from "./Brand";
import { Category } from "./Category";
import { Color } from "./Color";
import { Feature } from "./Feature";
import { Media } from "./Media";
import { Price } from "./Price";
import { Review } from "./Review";
import { User } from "./User";
export type ProductDimension = {
    has_height: boolean;
    has_depth: boolean;
    has_width: boolean;
    height_unit: 'cm' | 'in';
    depth_unit: 'cm' | 'in';
    width_unit: 'cm' | 'in';
    height: number;
    depth: number;
    width: number;
};
export type ProductWeight = {
    has_weight: boolean;
    weight_unit: 'kg' | 'lb';
    weight: number;
};
export interface Product extends ProductDimension, ProductWeight {
    id: number;
    name: string;
    title: string;
    description: string;
    active: boolean;
    allow_offers: boolean;
    sku?: string;
    quantity: number;
    type: 'digital' | 'physical' | 'service';
    user: User;
    follows: Array<ProductFollow>;
    features: Array<ProductFeature>;
    reviews: Array<ProductReview>;
    categories: Array<Category>;
    brands: Array<ProductBrand>;
    colors: Array<ProductColor>;
    product_categories: Array<ProductCategory>;
    prices: Array<Price>;
    media: Array<Media>;
    created_at: string;
    updated_at: string;
}

export type ProductHealthCheckItem = {
    is_healthy: boolean;
    message: string;
}
export type ProductHealthCheck = {
    unhealthy: {
        count: number;
        items: Array<ProductHealthCheckItem>;
    };
    healthy: {
        count: number;
        items: Array<ProductHealthCheckItem>;
    };
};
export interface ProductRequest extends ProductDimension, ProductWeight {
    name?: string;
    title?: string;
    description?: string;
    active?: boolean;
    allow_offers?: boolean;
    sku?: string;
    quantity?: number;
    user?: number;
    type: 'digital' | 'physical' | 'service';
    has_height?: boolean;
    has_depth?: boolean;
    has_width?: boolean;
    has_weight?: boolean;
    height_unit?: 'cm' | 'in';
    depth_unit?: 'cm' | 'in';
    width_unit?: 'cm' | 'in';
    weight_unit?: 'kg' | 'lb';
    height?: number;
    length?: number;
    width?: number;
    weight?: number;  
    follow_users?: Array<number>;
    features?: Array<number>;
    reviews?: Array<Review>;
    categories?: Array<number>;
    brands?: Array<number>;
    colors?: Array<number>;
    product_categories?: Array<number>;
    media?: Array<Media>;
    prices?: Array<Price>;
}
export interface CreateProduct extends ProductRequest {
    type: 'physical' | 'digital' | 'service';
    name: string;
    title: string;
    active: boolean;
}
export interface UpdateProduct extends ProductRequest {
    id: number;
}
export type ProductCategory = {
    id: number;
    name: string;
    label: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}
export type ProductCategoryRequest = {
    name: string;
    label: string;
}
export interface CreateProductCategory extends ProductCategoryRequest {
    name: string;
    label: string;
}
export interface UpdateProductCategory extends ProductCategoryRequest {
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
export type ProductProductCategory = {
    id: number;
    product: Product;
    product_category: ProductCategory;
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
