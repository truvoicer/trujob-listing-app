import { OrderItem } from "@/types/Cashier";
import { ProductOrderItemService } from "./product/ProductOrderItemService";

export class OrderItemFactory {
    
    build(item: OrderItem, index: number, props: Record<string, any>): any {
        switch (item.productable_type) {
            case 'App\\Models\\Product':
                const productOrderItemService = new ProductOrderItemService();
                return productOrderItemService.renderOrderItem(item, index, props);
            default:
                console.warn(`No service found for order item type: ${item.productable_type}`);
                return null;    
        }       
    }
}