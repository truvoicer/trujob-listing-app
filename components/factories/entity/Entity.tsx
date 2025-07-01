import ManageCategoryEntity from "@/components/blocks/Admin/Category/ManageCategoryEntity";
import ManageCountryEntity from "@/components/blocks/Admin/Country/ManageCountryEntity";
import ManageCurrencyEntity from "@/components/blocks/Admin/Currency/ManageCurrencyEntity";
import ManageProductEntity from "@/components/blocks/Admin/Product/ManageProductEntity";
import ManageRegionEntity from "@/components/blocks/Admin/Region/ManageRegionEntity";
export type EntityItem = {
    title: string;
    description: string;
    icon: string;
    component: React.ComponentType<any>;
};
export class Entity {
   static PRODUCT: string = 'product';
   static CATEGORY: string = 'category';
   static CURRENCY: string = 'currency';
   static COUNTRY: string = 'country';
   static REGION: string = 'region';

    static getEntities(): Record<string, EntityItem> 
    {
        return {
            [Entity.PRODUCT]: {
                title: 'Hero Block',
                description: 'This is the hero block',
                icon: 'hero-block-icon',
                component: ManageProductEntity,
            },
            [Entity.CATEGORY]: {
                title: 'Category Block',
                description: 'This is the category block',
                icon: 'category-block-icon',
                component: ManageCategoryEntity,
            },
            [Entity.CURRENCY]: {
                title: 'Currency Block',
                description: 'This is the currency block',
                icon: 'currency-block-icon',
                component: ManageCurrencyEntity,
            },
            [Entity.COUNTRY]: {
                title: 'Country Block',
                description: 'This is the country block',
                icon: 'country-block-icon',
                component: ManageCountryEntity,
            },
            [Entity.REGION]: {
                title: 'Region Block',
                description: 'This is the region block',
                icon: 'region-block-icon',
                component: ManageRegionEntity,
            },
        };
    }
}
