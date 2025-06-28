import FeaturedSection from "@/components/blocks/featured/FeaturedSection";
import IconGridSection from "@/components/blocks/icon-grid/IconGridSection";
import HeroSection from "@/components/blocks/hero/HeroSection";
import ProductsBlock from "@/components/products/ProductsBlock";
import LoginBlock from "@/components/blocks/Auth/LoginBlock";
import RegisterBlock from "@/components/blocks/Auth/RegisterBlock";
import ManagePage from "@/components/blocks/Admin/Page/ManagePage";
import ManageProduct from "@/components/blocks/Admin/Product/ManageProduct";
import ManageSidebar from "@/components/blocks/Admin/Sidebar/ManageSidebar";
import ManageMenu from "@/components/blocks/Admin/Menu/ManageMenu";
import ManageWidget from "@/components/blocks/Admin/Widget/ManageWidget";
import ManageUser from "@/components/blocks/Admin/User/ManageUser";
import ManageBrand from "@/components/blocks/Admin/Brand/ManageBrand";
import ManageCategory from "@/components/blocks/Admin/Category/ManageCategory";
import ManageColor from "@/components/blocks/Admin/Color/ManageColor";
import ManageProductCategory from "@/components/blocks/Admin/ProductCategory/ManageProductCategory";
import ManageFeature from "@/components/blocks/Admin/Feature/ManageFeature";
import ManageReview from "@/components/blocks/Admin/Review/ManageReview";
import { ComponentHelpers } from "@/helpers/ComponentHelpers";
import ManageSiteSettings from "@/components/blocks/Admin/Settings/ManageSiteSettings";
import ManagePaymentGateway from "@/components/blocks/Admin/Payment/PaymentGateway/ManagePaymentGateway";
import ManageAddress from "@/components/blocks/Admin/User/Address/ManageAddress";
import ManageTaxRate from "@/components/blocks/Admin/Tax/TaxRate/ManageTaxRate";
import ManageDiscount from "@/components/blocks/Admin/Discount/ManageDiscount";
import ManageShippingMethod from "@/components/blocks/Admin/Shipping/ShippingMethod/ManageShippingMethod";
import ManageShippingZone from "@/components/blocks/Admin/Shipping/ShippingZone/ManageShippingZone";
import EditProfile from "@/components/blocks/Admin/User/Profile/EditProfile";

export class Blocks {
    static HERO_BLOCK = 'hero-block';
    static FEATURED_BLOCK = 'featured-block';
    static ICON_GRID_BLOCK = 'icon-grid-block';
    static PRODUCTS_GRID_BLOCK = 'products-grid-block';
    static LOGIN_BLOCK = 'login-block';
    static REGISTER_BLOCK = 'register-block';
    static MANAGE_PAGES_BLOCK = 'manage-pages-block';
    static MANAGE_SIDEBARS_BLOCK = 'manage-sidebars-block';
    static MANAGE_WIDGETS_BLOCK = 'manage-widgets-block';
    static MANAGE_MENUS_BLOCK = 'manage-menus-block';
    static MANAGE_USERS_BLOCK = 'manage-users-block';
    static MANAGE_PRODUCTS_BLOCK = 'manage-products-block';
    static MANAGE_BRANDS_BLOCK = 'manage-brands-block';
    static MANAGE_CATEGORIES_BLOCK = 'manage-categories-block';
    static MANAGE_COLORS_BLOCK = 'manage-colors-block';
    static MANAGE_PRODUCT_CATEGORIES_BLOCK = 'manage-product-categories-block';
    static MANAGE_FEATURES_BLOCK = 'manage-features-block';
    static MANAGE_REVIEWS_BLOCK = 'manage-reviews-block';
    static MANAGE_SITE_SETTINGS_BLOCK = 'manage-site-settings-block';
    static MANAGE_PAYMENT_GATEWAYS_BLOCK = 'manage-payment-gateways-block';
    static MANAGE_PAYMENT_METHODS_BLOCK = 'manage-payment-methods-block';
    static MANAGE_ADDRESSES_BLOCK = 'manage-addresses-block';
    static MANAGE_TAX_RATES_BLOCK = 'manage-tax-rates-block';
    static MANAGE_DISCOUNTS_BLOCK = 'manage-discounts-block';
    static MANAGE_SHIPPING_METHODS_BLOCK = 'manage-shipping-methods-block';
    static MANAGE_SHIPPING_ZONES_BLOCK = 'manage-shipping-zones-block';
    static EDIT_PROFILE_BLOCK = 'edit-profile-block';
    static EDIT_ACCOUNT_SETTINGS_BLOCK = 'edit-account-settings-block';

    static getBlocks() {
        return {
            [Blocks.HERO_BLOCK]: {
                title: 'Hero Block',
                description: 'This is the hero block',
                icon: 'hero-block-icon',
                component: HeroSection,
            },
            [Blocks.FEATURED_BLOCK]: {
                title: 'Featured Block',
                description: 'This is the featured block',
                icon: 'featured-block-icon',
                component: FeaturedSection,
            },
            [Blocks.ICON_GRID_BLOCK]: {
                title: 'Icon Grid Block',
                description: 'This is the icon grid block',
                icon: 'icon-grid-block-icon',
                component: IconGridSection,
            },
            [Blocks.PRODUCTS_GRID_BLOCK]: {
                title: 'Products Grid Block',
                description: 'This is the products grid block',
                icon: 'products-grid-block-icon',
                component: ProductsBlock,
            },
            [Blocks.LOGIN_BLOCK]: {
                title: 'Login Block',
                description: 'This is the login block',
                icon: 'login-block-icon',
                component: LoginBlock,
            },
            [Blocks.REGISTER_BLOCK]: {
                title: 'Register Block',
                description: 'This is the register block',
                icon: 'register-block-icon',
                component: RegisterBlock,
            },
            [Blocks.MANAGE_PAGES_BLOCK]: {
                title: 'Manage Pages Block',
                description: 'This is the manage pages block',
                icon: 'manage-pages-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManagePage,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_SIDEBARS_BLOCK]: {
                title: 'Manage Sidebars',
                description: 'This is the manage sidebars',
                icon: 'manage-products-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageSidebar,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_WIDGETS_BLOCK]: {
                title: 'Manage Widgets',
                description: 'This is the manage widgets',
                icon: 'manage-products-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageWidget,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_MENUS_BLOCK]: {
                title: 'Manage Menus',
                description: 'This is the manage menus',
                icon: 'manage-products-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageMenu,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_USERS_BLOCK]: {
                title: 'Manage Users',
                description: 'This is the manage users',
                icon: 'manage-users-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageUser,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_PRODUCTS_BLOCK]: {
                title: 'Manage Products Block',
                description: 'This is the manage products block',
                icon: 'manage-products-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageProduct,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_BRANDS_BLOCK]: {
                title: 'Manage Brands Block',
                description: 'This is the manage brands block',
                icon: 'manage-brands-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageBrand,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_CATEGORIES_BLOCK]: {
                title: 'Manage Categories Block',
                description: 'This is the manage categories block',
                icon: 'manage-categories-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageCategory,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_COLORS_BLOCK]: {
                title: 'Manage Colors Block',
                description: 'This is the manage colors block',
                icon: 'manage-colors-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageColor,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_PRODUCT_CATEGORIES_BLOCK]: {
                title: 'Manage Product Categories Block',
                description: 'This is the manage product categories block',
                icon: 'manage-product-categories-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageProductCategory,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_FEATURES_BLOCK]: {
                title: 'Manage Features Block',
                description: 'This is the manage features block',
                icon: 'manage-features-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageFeature,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_REVIEWS_BLOCK]: {
                title: 'Manage Reviews Block',
                description: 'This is the manage reviews block',
                icon: 'manage-reviews-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageReview,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_SITE_SETTINGS_BLOCK]: {
                title: 'Manage Site Settings Block',
                description: 'This is the manage site settings block',
                icon: 'manage-site-settings-block-icon',
                component: ManageSiteSettings,
            },
            [Blocks.MANAGE_PAYMENT_GATEWAYS_BLOCK]: {
                title: 'Manage Payment Gateways Block',
                description: 'This is the manage payment gateways block',
                icon: 'manage-payment-gateways-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManagePaymentGateway,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_PAYMENT_METHODS_BLOCK]: {
                title: 'Manage Payment Methods Block',
                description: 'This is the manage payment methods block',
                icon: 'manage-payment-methods-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManagePaymentGateway,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_ADDRESSES_BLOCK]: {
                title: 'Manage Addresses Block',
                description: 'This is the manage addresses block',
                icon: 'manage-addresses-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageAddress,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_TAX_RATES_BLOCK]: {
                title: 'Manage Tax Rates Block',
                description: 'This is the manage tax rates block',
                icon: 'manage-tax-rates-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageTaxRate,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_DISCOUNTS_BLOCK]: {
                title: 'Manage Discounts Block',
                description: 'This is the manage discounts block',
                icon: 'manage-discounts-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageDiscount,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_SHIPPING_METHODS_BLOCK]: {
                title: 'Manage Shipping Methods Block',
                description: 'This is the manage shipping methods block',
                icon: 'manage-shipping-methods-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageShippingMethod,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.MANAGE_SHIPPING_ZONES_BLOCK]: {
                title: 'Manage Shipping Zones Block',
                description: 'This is the manage shipping zones block',
                icon: 'manage-shipping-zones-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageShippingZone,
                    {
                        mode: 'edit',
                    }
                ),
            },
            [Blocks.EDIT_PROFILE_BLOCK]: {
                title: 'Edit Profile Block',
                description: 'This is the edit profile block',
                icon: 'edit-profile-block-icon',
                component: ComponentHelpers.buildComponent(
                    EditProfile,
                ),
            },
            [Blocks.EDIT_ACCOUNT_SETTINGS_BLOCK]: {
                title: 'Edit Account Settings Block',
                description: 'This is the edit account settings block',
                icon: 'edit-account-settings-block-icon',
                component: ComponentHelpers.buildComponent(
                    ManageSiteSettings,
                    {
                        mode: 'edit',
                    }
                ),
            },
        };
    }
}
