import { OrderItem } from "@/types/Order";
import { OrderItemFactory } from "./OrderItemFactory";

export class OrderItemService {

    private orderItemFactory: OrderItemFactory

    constructor() {
        this.orderItemFactory = new OrderItemFactory();
    }

    getOrderItemFactory(): OrderItemFactory {
        return this.orderItemFactory;
    }

    getPrice(item: OrderItem): number {
        if (item && item.total_price) {
            return item.total_price;
        }
        return 0; // Default price if not available
    }
    
    getQuantity(item: OrderItem): number {
        if (item && item.quantity) {
            return item.quantity;
        }
        return 1; // Default quantity if not available
    }
    
    getTotal(item: OrderItem): number {
        if (item && item.total_price_after_tax_and_discount) {
            return item.total_price_after_tax_and_discount;
        }
        return 0; // Default price if not available
    }
    
}