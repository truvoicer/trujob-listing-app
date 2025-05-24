import { OrderItem } from "@/types/Cashier";
import { TransactionService } from "./TransactionService";
import { OrderItemFactory } from "./order/item/OrderItemFactory";

export class OrderService {

    static ORDER_FIELDS = [
        'id',
        'user_id',
        'status',
        'total_amount',
        'currency',
        'created_at',
        'updated_at',
        'items',
        'billing_address',
        'shipping_address',
    ];

    transactionService: TransactionService;
    orderItemFactory: OrderItemFactory;

    constructor(
        private order: any,
    ) {
        this.transactionService = new TransactionService(); // Initialize transaction service if needed
        this.orderItemFactory = new OrderItemFactory();
    }
    getTransactionService(): TransactionService {
        return this.transactionService;
    }

    getOrderItemFactory(): OrderItemFactory {
        return this.orderItemFactory;
    }
    
}