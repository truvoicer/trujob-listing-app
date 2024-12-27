import FeaturedSection from "@/components/listings/featured/FeaturedSection";
import IconGridSection from "@/components/listings/icon-grid/IconGridSection";
import ListingsGrid from "@/components/listings/grid/ListingsGrid";
import HeroSection from "@/components/listings/hero/HeroSection";

export class Blocks {
    static HERO_BLOCK = 'hero-block';
    static FEATURED_BLOCK = 'featured-block';
    static ICON_GRID_BLOCK = 'icon-grid-block';
    static LISTINGS_GRID_BLOCK = 'listings-grid-block';

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
                component: ListingsGrid,
            },
        };
    }
}
