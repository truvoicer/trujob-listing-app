import { ProductableOrderService } from "./product/ProductableOrderService";
import { ProductOrderItemService } from "./product/ProductOrderItemService";

export class OrderItemFactory {
    
    constructor() {
        console.log("OrderItemFactory initialized");
    }
    make(type: string|null): ProductableOrderService|null {
        switch (type) {
            case 'product':
                return ProductOrderItemService.getInstance();
            default:
                console.warn(`No service found for order item type: ${type}`);
                return null;    
        }       
    }
}