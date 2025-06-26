import { OrderItem } from "@/types/Cashier";
import { ProductOrderItemService } from "./product/ProductOrderItemService";

export class OrderItemFactory {
    
    build(item: OrderItem, index: number, props: Record<string, any>): any {
        console.log("Building order item", item, index, props);
        switch (item.productable_type) {
            case 'product':
                const productOrderItemService = new ProductOrderItemService();
                return productOrderItemService.renderOrderItem(item, index, props);
            default:
                console.warn(`No service found for order item type: ${item.productable_type}`);
                return null;    
        }       
    }
}