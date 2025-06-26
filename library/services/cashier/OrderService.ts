import { Order } from "@/types/Cashier";
import { TransactionService } from "./TransactionService";
import { OrderItemService } from "./order/item/OrderItemService";
import { Currency } from "@/types/Currency";

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

    private orderItemService: OrderItemService

    constructor(
        private order: Order = {} as Order,
    ) {
        this.transactionService = new TransactionService();
        this.orderItemService = new OrderItemService();
    }

    getTransactionService(): TransactionService {
        return this.transactionService;
    }

    getOrderItemService(): OrderItemService {
        return this.orderItemService;
    }
    getTotalTaxAmount(order: Order | null): number {
        if (!order) {
            return 0;
        }
        return order.total_tax || 0;
    }
    
    getTotalDiscountAmount(order: Order | null): number {
        if (!order) {
            return 0;
        }
        return order.total_discount || 0;
    }

    getCurrency(order: Order | null): string {
        if (!order) {
            return '';
        }
        const currency : Currency | null = order?.currency || null;
        if (!currency) {
            return '';
        }
        return currency.name;
    }
    
    getTotalAmount(order: Order | null): number | string {
        if (!order) {
            return '0.00';
        }
        return order.total_price_after_tax_and_discounts || 0;
    }

    getTotalQuantity(order: Order | null): number {
        if (!order) {
            return 0;
        }
        return order.total_quantity || 0;
    }
}