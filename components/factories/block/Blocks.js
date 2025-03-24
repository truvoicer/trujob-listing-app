import FeaturedSection from "@/components/blocks/featured/FeaturedSection";
import IconGridSection from "@/components/blocks/icon-grid/IconGridSection";
import HeroSection from "@/components/blocks/hero/HeroSection";
import ListingsBlock from "@/components/listings/ListingsBlock";
import LoginBlock from "@/components/blocks/Auth/LoginBlock";
import RegisterBlock from "@/components/blocks/Auth/RegisterBlock";

export class Blocks {
    static HERO_BLOCK = 'hero-block';
    static FEATURED_BLOCK = 'featured-block';
    static ICON_GRID_BLOCK = 'icon-grid-block';
    static LISTINGS_GRID_BLOCK = 'listings-grid-block';
    static LOGIN_BLOCK = 'login-block';
    static REGISTER_BLOCK = 'register-block';

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
            [Blocks.LISTINGS_GRID_BLOCK]: {
                title: 'Listings Grid Block',
                description: 'This is the listings grid block',
                icon: 'listings-grid-block-icon',
                component: ListingsBlock,
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
        };
    }
}
