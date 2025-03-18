import GridItemBusiness from "@/components/listings/grid/items/GridItemBusiness";
import GridItemCourse from "@/components/listings/grid/items/GridItemCourse";
import GridItemEvent from "@/components/listings/grid/items/GridItemEvent";
import GridItemFood from "@/components/listings/grid/items/GridItemFood";
import GridItemItem from "@/components/listings/grid/items/GridItemItem";
import GridItemJob from "@/components/listings/grid/items/GridItemJob";
import GridItemPet from "@/components/listings/grid/items/GridItemPet";
import GridItemProperty from "@/components/listings/grid/items/GridItemProperty";
import GridItemRealEstate from "@/components/listings/grid/items/GridItemRealEstate";
import GridItemService from "@/components/listings/grid/items/GridItemService";
import GridItemTicket from "@/components/listings/grid/items/GridItemTicket";
import GridItemVehicle from "@/components/listings/grid/items/GridItemVehicle";

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