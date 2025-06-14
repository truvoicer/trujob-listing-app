import ManageCategory from "@/components/blocks/Admin/Category/ManageCategory";
import ManageCountry from "@/components/blocks/Admin/Country/ManageCountry";
import ManageCurrency from "@/components/blocks/Admin/Currency/ManageCurrency";
import ManageProduct from "@/components/blocks/Admin/Product/ManageProduct";
import ManageRegion from "@/components/blocks/Admin/Region/ManageRegion";
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
                component: ManageProduct,
            },
            [Entity.CATEGORY]: {
                title: 'Category Block',
                description: 'This is the category block',
                icon: 'category-block-icon',
                component: ManageCategory,
            },
            [Entity.CURRENCY]: {
                title: 'Currency Block',
                description: 'This is the currency block',
                icon: 'currency-block-icon',
                component: ManageCurrency,
            },
            [Entity.COUNTRY]: {
                title: 'Country Block',
                description: 'This is the country block',
                icon: 'country-block-icon',
                component: ManageCountry,
            },
            [Entity.REGION]: {
                title: 'Region Block',
                description: 'This is the region block',
                icon: 'region-block-icon',
                component: ManageRegion,
            },
        };
    }
}
