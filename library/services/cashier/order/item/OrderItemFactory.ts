import { OrderItem } from "@/types/Cashier";
import { ListingOrderItemService } from "./listing/ListingOrderItemService";

export class OrderItemFactory {
    
    build(item: OrderItem, index: number, props: Record<string, any>): any {
        switch (item.order_itemable_type) {
            case 'App\\Models\\Listing':
                const listingOrderItemService = new ListingOrderItemService();
                return listingOrderItemService.renderOrderItem(item, index, props);
            default:
                console.warn(`No service found for order item type: ${item.order_itemable_type}`);
                return null;    
        }       
    }
}