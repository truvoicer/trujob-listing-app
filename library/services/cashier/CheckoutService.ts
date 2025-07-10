import { Order } from "@/types/Order";
import { PaymentGateway } from "@/types/PaymentGateway";
import { Price } from "@/types/Price";
import { OrderService } from "./OrderService";

export class CheckoutService {
    orderService: any;
    constructor(
        private order: Order,
        private price: Price,
        private paymentMethod: PaymentGateway,
    ) {
        this.orderService = new OrderService(order, price, paymentMethod);
    }
    getOrderService(): OrderService {
        return this.orderService;
    }
    
}