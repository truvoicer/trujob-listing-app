import { PaymentService } from "./Service/PaymentService";
import { PayPalService } from "./Service/PayPalService";
import { StripeService } from "./Service/StripeService";


export class PaymentFactory {
    
    constructor() {
        console.log("PaymentFactory initialized");
    }
    static make(provider: string|null): PaymentService|null {
        switch (provider) {
            case 'paypal':
                return new PayPalService();
            case 'stripe':
                return new StripeService();
            default:
                console.warn(`No service found for order item type: ${provider}`);
                return null;    
        }       
    }
}