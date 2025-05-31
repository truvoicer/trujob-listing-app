import GridItemBusiness from "@/components/products/grid/items/GridItemBusiness";
import GridItemCourse from "@/components/products/grid/items/GridItemCourse";
import GridItemEvent from "@/components/products/grid/items/GridItemEvent";
import GridItemFood from "@/components/products/grid/items/GridItemFood";
import GridItemItem from "@/components/products/grid/items/GridItemItem";
import GridItemJob from "@/components/products/grid/items/GridItemJob";
import GridItemPet from "@/components/products/grid/items/GridItemPet";
import GridItemProperty from "@/components/products/grid/items/GridItemProperty";
import GridItemRealEstate from "@/components/products/grid/items/GridItemRealEstate";
import GridItemService from "@/components/products/grid/items/GridItemService";
import GridItemTicket from "@/components/products/grid/items/GridItemTicket";
import GridItemVehicle from "@/components/products/grid/items/GridItemVehicle";

export default [
    {
        type: 'event',
        component: GridItemEvent
    },
    {
        type: 'vehicle',
        component: GridItemVehicle
    },
    {
        type: 'service',
        component: GridItemService
    },
    {
        type: 'real-estate',
        component: GridItemRealEstate
    },
    {
        type: 'job',
        component: GridItemJob
    },
    {
        type: 'pet',
        component: GridItemPet
    },
    {
        type: 'item',
        component: GridItemItem
    },
    {
        type: 'property',
        component: GridItemProperty
    },
    {
        type: 'business',
        component: GridItemBusiness
    },
    {
        type: 'ticket',
        component: GridItemTicket
    },
    {
        type: 'course',
        component: GridItemCourse
    },
    {
        type: 'food',
        component: GridItemFood
    },
];